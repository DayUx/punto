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
  this.initCards().then(() => {
    this.shuffleAllPlayerCards().then(() => {
      this.users.forEach((u) => {
        u.pickNextCard();
      });
    });
  });

  this.grid = new Grid(game.grid);
}

GameClass.prototype.shuffleAllPlayerCards = function () {
  console.log("shuffleAllPlayerCards");
  return new Promise(async (resolve, reject) => {
    let itemProcessed = 0;
    for (const u of this.users) {
      await u.shuffleCards();
      itemProcessed++;
      if (itemProcessed === this.users.length) {
        resolve();
      }
    }
  });
};

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

GameClass.prototype.nextPlayer = async function () {
  return new Promise(async (resolve, reject) => {
    console.log("nextPlayer");
    const playerPlaying = await this.getPlayerPlaying();
    const index = this.users.indexOf(playerPlaying);
    console.log("index", index);
    this.users.forEach((u) => {
      u.playing = false;
    });
    if (index === this.users.length - 1) {
      resolve((this.users[0].playing = true));
    } else {
      resolve((this.users[(index + 1) % this.users.length].playing = true));
    }
  });
};

GameClass.prototype.setUserOk = async function (id) {
  console.log("setUserOk", id);
  for (const u of this.users) {
    if (u.id === id) {
      u.setUserOk();
      global.io.to(id).emit("updateGame", {
        card: u.currentCard,
        grid: this.grid,
        playerPlaying: await this.getPlayerPlaying(),
      });
    }
  }
};

GameClass.prototype.checkPlay = async function (userId, x, y) {
  return new Promise(async (resolve, reject) => {
    console.log("checkPlay", userId, x, y);
    const user = await this.getPlayer(userId);
    const card = await user.currentCard;
    const playerPlaying = await this.getPlayerPlaying();
    if (user && playerPlaying.id === userId) {
      const isPlaced = await this.grid.placeCard(card, x, y);
      if (isPlaced) {
        await this.grid.setPlacable(card.color);
        await user.pickNextCard();
        let count = 4;
        if (this.users.length === 2) {
          count = 5;
        }
        this.grid.doesUserWin(user, count)
          ? (user.win = true)
          : await this.nextPlayer();
        this.updateUsers();
        resolve();
        return;
      }
    }
    global.io.to(userId).emit("updateGame", {
      card: user.currentCard,
      grid: this.grid,
      playerPlaying: playerPlaying,
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

GameClass.prototype.updateUsers = async function () {
  console.log("updateUsers");
  for (const u of this.users) {
    global.io.to(u.id).emit("updateGame", {
      card: u.currentCard,
      grid: this.grid,
      playerPlaying: await this.getPlayerPlaying(),
    });
  }
};

GameClass.prototype.isGameReady = function () {
  return this.users.every((u) => u.ok);
};

GameClass.prototype.addUser = function (user) {
  this.users.push(user);
};

GameClass.prototype.initCards2 = function () {
  const numberOfCards = 72 / 4;
  this.users.forEach((user, index, array) => {
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
  this.users.forEach((user, index, array) => {
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
  return new Promise(async (resolve, reject) => {
    switch (this.users.length) {
      case 2:
        resolve(await this.initCards2());
        break;
      case 3:
        await this.initCards3Or4();
        break;
      case 4:
        resolve(await this.initCards3Or4());
        break;
    }
    const cardsValue = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9];
    const shuffledArray = cardsValue.sort((a, b) => 0.5 - Math.random());

    let itemProcessed = 0;
    this.users.forEach((u, index, array) => {
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
