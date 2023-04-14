const Grid = require("./Grid");
const User = require("./User");
const Card = require("./Card");
const Game = require("../model/GameModel");

function GameClass(game) {
  this.id = game._id;
  this.players = [];
  this.color = ["rouge", "bleu", "vert", "jaune"];
  if (game.players.length === 2) {
    game.players.forEach((p) => {
      this.addUser(
        new User(p.user_id, p.username, [this.color.pop(), this.color.pop()])
      );
    });
  } else {
    game.players.forEach((p) => {
      this.addUser(new User(p.user_id, p.username, [this.color.pop()]));
    });
  }
  this.players[0].playing = true;
  this.initCards().then(() => {
    this.shuffleAllPlayerCards().then(() => {
      this.players.forEach((u) => {
        u.pickNextCard();
      });
    });
  });

  this.grid = new Grid(game.grid);
}

GameClass.prototype.shuffleAllPlayerCards = function () {
  return new Promise(async (resolve) => {
    let itemProcessed = 0;
    for (const u of this.players) {
      await u.shuffleCards();
      itemProcessed++;
      if (itemProcessed === this.players.length) {
        resolve();
      }
    }
  });
};

GameClass.prototype.getPlayerPlaying = async function () {
  return new Promise((resolve) => {
    this.players.forEach((u) => {
      if (u.playing) {
        resolve(u);
      }
    });
  });
};

GameClass.prototype.nextPlayer = async function () {
  return new Promise(async (resolve, reject) => {
    const playerPlaying = await this.getPlayerPlaying();
    const index = this.players.indexOf(playerPlaying);
    this.players.forEach((u) => {
      u.playing = false;
    });
    if (index === this.players.length - 1) {
      resolve((this.players[0].playing = true));
    } else {
      resolve((this.players[(index + 1) % this.players.length].playing = true));
    }
  });
};

GameClass.prototype.setUserOk = async function (id) {
  for (const u of this.players) {
    if (u.id === id) {
      u.setUserOk();
      global.io.to(id).emit("updateGame", {
        players: this.players,
        grid: this.grid,
        playerPlaying: await this.getPlayerPlaying(),
      });
    }
  }
};

GameClass.prototype.getWinner = function () {
  let winner = null;
  this.players.forEach((u) => {
    if (u.cards.length === 0) {
      winner = u;
    }
  });
  return winner;
};

GameClass.prototype.checkPlay = async function (userId, x, y) {
  return new Promise(async (resolve) => {
    const user = await this.getPlayer(userId);
    const card = await user.currentCard;
    const playerPlaying = await this.getPlayerPlaying();
    if (this.end) {
      global.io.to(user.id).emit("endOfGame", {
        winner: this.getWinner(),
      });
      resolve();
      return;
    }

    if (user && playerPlaying.id === userId) {
      const isPlaced = this.grid.placeCard(card, x, y);
      if (isPlaced) {
        await user.pickNextCard();
        await this.nextPlayer();
        const playerPlaying = await this.getPlayerPlaying();
        await this.grid.setPlacable(playerPlaying.currentCard?.value);
        let count = 4;
        if (this.players.length === 2) {
          count = 5;
        }
        if (this.grid.doesUserWin(user, count)) {
          this.end = true;
          for (const u of this.players) {
            global.io.to(u.id).emit("endOfGame", {
              winner: user,
            });
          }
        }
        await this.save();
        await this.updateUsers();
        resolve();
      }
    }
  });
};

GameClass.prototype.save = async function () {
  await Game.updateOne(
    { _id: this.id },
    {
      $set: {
        players: this.players.map((u) => {
          return {
            user_id: u.id,
            username: u.username,
            win: u.win,
          };
        }),
        grid: this.grid.grid,
        end: this.end,
      },
    }
  );
};

GameClass.prototype.getPlayer = async function (id) {
  return new Promise((resolve) => {
    this.players.forEach((u) => {
      if (u.id === id) {
        resolve(u);
      }
    });
  });
};

GameClass.prototype.updateUsers = async function () {
  for (const u of this.players) {
    global.io.to(u.id).emit("updateGame", {
      players: this.players,
      grid: this.grid,
      playerPlaying: await this.getPlayerPlaying(),
    });
  }
};

GameClass.prototype.isGameReady = function () {
  return this.players.every((u) => u.ok);
};

GameClass.prototype.addUser = function (user) {
  this.players.push(user);
};

GameClass.prototype.initCards2 = function () {
  const numberOfCards = 72 / 4;
  this.players.forEach((user, index, array) => {
    for (let i = 0; i < numberOfCards / 2; i++) {
      user.addCard(
        new Card(`${user.id}${i}${user.colors[0]}`, user.colors[0], i + 1)
      );
      user.addCard(
        new Card(`${user.id}${i}bis${user.colors[0]}`, user.colors[0], i + 1)
      );
    }
    for (let i = 0; i < numberOfCards / 2; i++) {
      user.addCard(
        new Card(`${user.id}${i}${user.colors[1]}`, user.colors[1], i + 1)
      );
      user.addCard(
        new Card(`${user.id}${i}bis${user.colors[1]}`, user.colors[1], i + 1)
      );
    }
  });
};

GameClass.prototype.initCards3Or4 = function () {
  const numberOfCards = 72 / 4;
  this.players.forEach((user) => {
    for (let i = 0; i < numberOfCards / 2; i++) {
      user.addCard(
        new Card(`${user.id}${i}${user.colors[0]}`, user.colors[0], i + 1)
      );
      user.addCard(
        new Card(`${user.id}${i}bis${user.colors[0]}`, user.colors[0], i + 1)
      );
    }
  });
};

GameClass.prototype.initCards = function () {
  const numberOfCards = 72 / 4;
  return new Promise(async (resolve) => {
    switch (this.players.length) {
      case 2:
        await this.initCards2();
        resolve();
        return;
      case 3:
        await this.initCards3Or4();
        break;
      case 4:
        await this.initCards3Or4();
        resolve();
        return;
    }
    const cardsValue = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9];
    const shuffledArray = cardsValue.sort((a, b) => 0.5 - Math.random());
    let itemProcessed = 0;
    this.players.forEach((u, index, array) => {
      for (let i = 0; i < numberOfCards / 2 / 3; i++) {
        u.addCard(
          new Card(
            `${u.id}${i}${this.color[0]}`,
            this.color[0],
            shuffledArray.pop()
          )
        );
        u.addCard(
          new Card(
            `${u.id}${i}bis${this.color[0]}`,
            this.color[0],
            shuffledArray.pop()
          )
        );
        itemProcessed++;
        if (itemProcessed === array.length) {
          resolve();
        }
      }
    });
  });
};

GameClass.prototype.placeCard = function (user, card, x, y) {
  if (this.grid.placeCard(card, x, y)) {
    user.removeCard(card.id);
    return true;
  }
  return false;
};
module.exports = GameClass;
