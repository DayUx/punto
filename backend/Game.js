import { Grid } from "./Grid";

export class Game {
  constructor(game) {
    this.users = [];
    this.grid = new Grid(game.grid);
  }

  addUser(user) {
    this.users.push(user);
  }

  drawCard(user) {}

  placeCard(user, card, x, y) {
    if (this.grid.placeCard(card, x, y)) {
      user.removeCard(card.id);
      return true;
    }
    return false;
  }
}
