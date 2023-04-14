const User = require("../model/UserModel");
const Game = require("../model/GameModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const GameClass = require("./GameClass");

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Password is invalid",
      });
    }
    delete user.password;
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).json({ user: token });
  } catch (e) {
    next(e);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const mailCheck = await User.findOne({ email: email });
    const usernameCheck = await User.findOne({ username: username });
    if (mailCheck) {
      return res.status(401).json({
        message: "Mail already used",
      });
    }

    if (usernameCheck) {
      return res.status(401).json({
        message: "Username already used",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
    });
    delete user.password;
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.json({ user: token });
  } catch (e) {
    next(e);
  }
};

module.exports.newGame = async (req, res, next) => {
  try {
    const { name, maxPlayers, numberPlayers } = req.body;
    const grid = Array(11)
      .fill()
      .map(() => Array(11).fill({ empty: true }));
    grid[5][5] = { empty: true, placable: true };
    const game = await Game.create({
      name: name,
      maxPlayers: maxPlayers,
      numberPlayers: numberPlayers,
      grid: grid,
      end: false,
      date: new Date(),
      aborted: false,
      players: [],
    });
    global.io.sockets.emit("updateGame", game);
    return res.status(200).json({ game: game });
  } catch (e) {
    next(e);
  }
};

module.exports.getHistorique = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    const userJson = jwt.verify(token, process.env.JWT_SECRET);
    const games = await Game.find({
      $and: [{ "players.user_id": userJson.id }, { end: true }],
    }).sort({
      date: -1,
    });
    return res.status(200).json({ games: games });
  } catch (e) {
    next(e);
  }
};

module.exports.joinGame = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    const userJson = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = req.body;
    const game = await Game.findOne({ _id: id });
    if (!game) {
      return res.status(400).json({
        message: "Game not found",
      });
    }
    let found = false;
    for (let i = 0; i < game.players.length && !found; i++) {
      if (game.players[i].user_id === userJson.id) {
        found = true;
      }
    }

    if (!found && game.players.length >= game.maxPlayers) {
      return res.status(400).json({
        message: "Game is full",
      });
    }

    if (!found) {
      let start = false;
      game.players.push({
        user_id: userJson.id,
        username: userJson.username,
        win: false,
      });
      if (game.players.length === game.maxPlayers) {
        game.start = true;
        start = true;
      }
      await game.save();
      if (start) {
        timeout(game).then(() => {
          global.io.to(game._id.toString()).emit("startGame", game);
          global.io.sockets.emit("removeGame", game);
          global.games[game._id.toString()] = new GameClass(game);
        });
        return res.status(200).json({ game: game });
      }
      global.io.to("gamelist").emit("updateGameList", {
        _id: game._id,
        numPlayers: game.players.length,
        name: game.name,
        maxPlayers: game.maxPlayers,
      });
      global.io.to(game._id.toString()).emit("updateGame", game);
    }

    return res.status(200).json({ game: game });
  } catch (e) {
    res.status(401).json({ message: "Token is invalid, please reconnect" });
    next(e);
  }
};

function timeout(game) {
  return new Promise((resolve) => {
    global.io
      .to(game._id.toString())
      .emit("loading", "TOUS LES JOUEURS SONT PRÊT");
    setTimeout(() => {
      global.io.to(game._id.toString()).emit("loading", "3");
      setTimeout(() => {
        global.io.to(game._id.toString()).emit("loading", "2");
        setTimeout(() => {
          global.io.to(game._id.toString()).emit("loading", "1");
          setTimeout(() => {
            resolve();
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000);
  }, 1000);
}

module.exports.getBestAndWorst = async (req, res, next) => {
  const playerWithMostWins = await Game.getPlayerWithMostWins();
  const playerWithMostLosses = await Game.getPlayerWithMostLosses();
  console.log("Joueur avec le plus de victoires : ", playerWithMostWins);
  console.log("Joueur avec le plus de défaites : ", playerWithMostLosses);

  return res.status(200).json({
    playerWithMostWins: playerWithMostWins,
    playerWithMostLosses: playerWithMostLosses,
  });
};

module.exports.getGames = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    jwt.verify(token, process.env.JWT_SECRET);
    const games = await Game.aggregate([
      {
        $match: {
          end: false,
          aborted: false,
          $expr: { $lt: [{ $size: "$players" }, "$maxPlayers"] },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          maxPlayers: 1,
          players: 1,
          numPlayers: { $size: "$players" },
        },
      },
      { $sort: { players: -1 } },
    ]);
    return res.status(200).json({ games: games });
  } catch (e) {
    res.status(401).json({ message: "Token is invalid, please reconnect" });
    next(e);
  }
};
