const Grid = require("./Grid");
const User = require("./User");
const Card = require("./Card");

function GameClass(game) {
  this.users = [];
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
  this.users[0].playing = true;
  this.initCards();
  this.grid = new Grid(game.grid);
}

GameClass.prototype.getPlayerPlaying = async function () {
  console.log("getPlayerPlaying");
  return new Promise((resolve, reject) => {
    this.users.forEach((u) => {
      if (u.playing) {
        resolve(u);
      }
    });
  });
};

GameClass.prototype.nextPlayer = function () {
  console.log("nextPlayer");
  const playerPlaying = this.getPlayerPlaying();
  const index = this.users.indexOf(playerPlaying);
  this.users.forEach((u) => {
    u.playing = false;
  });

  index === this.users.length - 1
    ? (this.users[0].playing = true)
    : (this.users[(index + 1) % this.users.length].playing = true);
};

GameClass.prototype.setUserOk = function (id) {
  console.log("setUserOk", id);
  this.users.forEach((u) => {
    if (u.id === id) {
      u.setUserOk();
      global.io.to(id).emit("updateGame", { cards: u.cards, grid: this.grid });
    }
  });
};

GameClass.prototype.checkPlay = async function (userId, cardId, x, y) {
  return new Promise(async (resolve, reject) => {
    console.log("checkPlay", userId, cardId, x, y);
    const user = await this.getPlayer(userId);
    const card = await user.getCard(cardId);
    const playerPlaying = await this.getPlayerPlaying();
    if (user && playerPlaying.id === userId) {
      if (this.grid.placeCard(card, x, y)) {
        await this.grid.setPlacable(card.color);
        user.removeCard(card.id);
        let count = 4;
        if (this.users.length === 2) {
          count = 5;
        }
        this.grid.doesUserWin(user, count)
          ? (user.win = true)
          : this.nextPlayer();
        this.updateUsers();
        resolve();
      }
    }
    global.io.to(userId).emit("updateGame", {
      cards: user.cards,
      grid: this.grid,
    });
  });
};

GameClass.prototype.getPlayer = async function (id) {
  console.log("getPlayer", id);
  return new Promise((resolve, reject) => {
    this.users.forEach((u) => {
      if (u.id === id) {
        resolve(u);
      }
    });
  });
};

GameClass.prototype.updateUsers = function () {
  console.log("updateUsers");
  this.users.forEach((u) => {
    global.io.to(u.id).emit("updateGame", { cards: u.cards, grid: this.grid });
  });
};

GameClass.prototype.isGameReady = function () {
  return this.users.every((u) => u.ok);
};

GameClass.prototype.addUser = function (user) {
  this.users.push(user);
};

GameClass.prototype.initCards = function () {
  const numberOfCards = 72 / 4;

  switch (this.users.length) {
    case 2:
      this.users.forEach((user) => {
        for (let i = 0; i < numberOfCards / 2; i++) {
          user.addCard(
            new Card(`${user.id}${i}${user.colors[0]}`, user.colors[0], i + 1)
          );
          user.addCard(
            new Card(
              `${user.id}${i}bis${user.colors[0]}`,
              user.colors[0],
              i + 1
            )
          );
        }
        for (let i = 0; i < numberOfCards / 2; i++) {
          user.addCard(
            new Card(`${user.id}${i}${user.colors[1]}`, user.colors[1], i + 1)
          );
          user.addCard(
            new Card(
              `${user.id}${i}bis${user.colors[1]}`,
              user.colors[1],
              i + 1
            )
          );
        }
      });
      break;
    case 3:
    case 4:
      this.users.forEach((user) => {
        for (let i = 0; i < numberOfCards / 2; i++) {
          user.addCard(
            new Card(`${user.id}${i}${user.colors[0]}`, user.colors[0], i + 1)
          );
          user.addCard(
            new Card(
              `${user.id}${i}bis${user.colors[0]}`,
              user.colors[0],
              i + 1
            )
          );
        }
      });
      break;
  }
  if (this.users.length === 3) {
    const cardsValue = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9];
    const shuffledArray = cardsValue.sort((a, b) => 0.5 - Math.random());

    this.users.forEach((u) => {
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
      }
    });
  }
};

GameClass.prototype.placeCard = function (user, card, x, y) {
  if (this.grid.placeCard(card, x, y)) {
    user.removeCard(card.id);
    return true;
  }
  return false;
};
module.exports = GameClass;
