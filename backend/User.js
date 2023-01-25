export class User {
  constructor(id, username) {
    this.id = id;
    this.username = username;
    this.cards = [];
  }

  addCard(card) {
    this.cards.push(card);
  }

  removeCard(id) {
    this.cards = this.cards.filter((c) => c.id !== id);
  }
}
