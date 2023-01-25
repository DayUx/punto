export class Grid {
  constructor(grid) {
    this.grid = grid;
  }
  placeCard(card, x, y) {
    if (this.grid[y][x].empty || this.grid[y][x].card.value < card.value) {
      this.grid[y][x].card = card;
      return true;
    }
    return false;
  }
}
