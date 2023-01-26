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
      aborted: false,
      players: [],
    });
    console.log("GAME UPDATE");
    global.io.sockets.emit("updateGame", game);
    return res.status(200).json({ game: game });
  } catch (e) {
    next(e);
  }
};
module.exports.joinGame = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    console.log("JOIN GAME", token);
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
        global.io.sockets.emit("startGame", game);
        global.io.sockets.emit("removeGame", game);
        global.games[game._id.toString()] = new GameClass(game);
        console.log("GAME START", game._id.toString());
        return res.status(200).json({ game: game });
        return;
      }
      console.log("GAME UPDATE", game._id.toString());
      global.io.to("gamelist").to(game._id.toString()).emit("updateGame", game);
    }

    return res.status(200).json({ game: game });
  } catch (e) {
    res.status(401).json({ message: "Token is invalid, please reconnect" });
    next(e);
  }
};

module.exports.getGames = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    jwt.verify(token, process.env.JWT_SECRET);
    const games = await Game.find({
      $where: function () {
        return this.players.length < this.maxPlayers;
      },
    });
    return res.status(200).json({ games: games });
  } catch (e) {
    res.status(401).json({ message: "Token is invalid, please reconnect" });
    next(e);
  }
};
