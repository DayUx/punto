function Grid(grid) {
  this.grid = grid;
}
Grid.prototype.placeCard = function (card, x, y) {
  console.log("placeCard : ", card, x, y);
  if (this.grid[y][x].empty || this.grid[y][x].card.value < card.value) {
    this.grid[y][x].card = card;
    this.grid[y][x].empty = false;
    return true;
  }
  return false;
};

Grid.prototype.setPlacable = function (color) {
  console.log("setPlacable");
  return new Promise(async (resolve, reject) => {
    for (const row of this.grid) {
      const rowIndex = this.grid.indexOf(row);
      for (const column of row) {
        const columnIndex = row.indexOf(column);
        if (!column.empty) {
          if (column.card.color !== color) {
            column.placable = true;
          }
          await this.setPlacableAroundCell(columnIndex, rowIndex, color);
        }
      }
    }
    resolve();
  });
};

Grid.prototype.setPlacableAroundCell = function (x, y, color) {
  return new Promise(async (resolve, reject) => {
    if (this.grid[y][x].empty) {
      return;
    }
    if (this.grid[y][x].card.color !== color) {
      return;
    }
    if (y > 0) {
      this.grid[y - 1][x].placable = true;
    }
    if (y < this.grid.length - 1) {
      this.grid[y + 1][x].placable = true;
    }
    if (x > 0) {
      this.grid[y][x - 1].placable = true;
    }
    if (x < this.grid.length - 1) {
      this.grid[y][x + 1].placable = true;
    }
    if (y > 0 && x < this.grid.length - 1) {
      this.grid[y - 1][x + 1].placable = true;
    }
    if (y < this.grid.length - 1 && x < this.grid.length - 1) {
      this.grid[y + 1][x + 1].placable = true;
    }
    if (y > 0 && x > 0) {
      this.grid[y - 1][x - 1].placable = true;
    }
    if (y < this.grid.length - 1 && x > 0) {
      this.grid[y + 1][x - 1].placable = true;
    }
    resolve();
  });
};

Grid.prototype.doesUserWin = function (user, count) {
  console.log("doesUserWin", user, count);

  return (
    this.isThereARowOf(user.color, count) ||
    this.isThereAColumnOf(user.color, count) ||
    this.isThereADiagonalOf(user.color, count)
  );
};

Grid.prototype.isThereARowOf = function (color, count) {
  console.log("isThereARowOf", color, count);
  this.grid.forEach((row) => {
    let i = 0;
    row.forEach((column) => {
      if (!column.empty && column.card.color === color) {
        i++;
      }
    });
    if (i >= count) {
      return true;
    }
  });
  return false;
};
Grid.prototype.isThereAColumnOf = function (color, count) {
  console.log("isThereAColumnOf", color, count);
  for (let i = 0; i < this.grid.length; i++) {
    let j = 0;
    for (let j = 0; j < this.grid.length; j++) {
      if (!this.grid[j][i].empty && this.grid[j][i].card.color === color) {
        j++;
      }
    }
    if (j >= count) {
      return true;
    }
  }
  return false;
};
Grid.prototype.isThereADiagonalOf = function (color, count) {
  console.log("isThereADiagonalOf", color, count);
  let i = 0;
  for (let j = 0; j < this.grid.length; j++) {
    if (!this.grid[j][j].empty && this.grid[j][j].card.color === color) {
      i++;
    }
  }
  if (i >= count) {
    return true;
  }
  i = 0;
  for (let j = 0; j < this.grid.length; j++) {
    if (
      !this.grid[j][this.grid.length - 1 - j].empty &&
      this.grid[j][this.grid.length - 1 - j].card.color === color
    ) {
      i++;
    }
  }
  if (i >= count) {
    return true;
  }
  return false;
};

module.exports = Grid;
