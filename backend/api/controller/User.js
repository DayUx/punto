function User(id, username, colors) {
  this.id = id;
  this.username = username;
  this.cards = [];
  this.win = false;
  this.colors = colors;
}

User.prototype.setUserOk = function () {
  this.ok = true;
};

User.prototype.addCard = function (card) {
  this.cards.push(card);
};

User.prototype.removeCard = function (id) {
  this.cards = this.cards.filter((c) => c.id !== id);
};

User.prototype.pickNextCard = function () {
  return new Promise((resolve) => {
    let card = this.cards[0];
    this.removeCard(card.id);
    this.currentCard = card;
    resolve(card);
  });
};

User.prototype.shuffleCards = function () {
  return new Promise(async (resolve) => {
    this.cards = this.cards.sort(() => Math.random() - 0.5);
    resolve();
  });
};

User.prototype.getCard = async function (id) {
  return new Promise((resolve) => {
    this.cards.forEach((c) => {
      if (c.id === id) {
        resolve(c);
      }
    });
  });
};
module.exports = User;
