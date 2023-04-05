const Debug = require("./Debug");

function User(id, username, colors) {
  this.id = id;
  this.username = username;
  this.cards = [];
  this.colors = colors;
}

User.prototype.setUserOk = function () {
  this.ok = true;
  Debug(this.id + " is ready");
};

User.prototype.addCard = function (card) {
  this.cards.push(card);
};

User.prototype.removeCard = function (id) {
  Debug("removeCard", id);
  this.cards = this.cards.filter((c) => c.id !== id);
};

User.prototype.pickNextCard = function () {
  Debug("pickNextCard");
  return new Promise((resolve, reject) => {
    let card = this.cards[0];
    this.removeCard(card.id);
    this.currentCard = card;
    resolve(card);
  });
};

User.prototype.shuffleCards = function () {
  Debug("shuffleCards");
  return new Promise(async (resolve, reject) => {
    this.cards = this.cards.sort(() => Math.random() - 0.5);
    resolve();
  });
};

User.prototype.getCard = async function (id) {
  Debug("getCard", id);
  return new Promise((resolve, reject) => {
    this.cards.forEach((c) => {
      if (c.id === id) {
        resolve(c);
      }
    });
  });
};
module.exports = User;
