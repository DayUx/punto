const Debug = require("./Debug");

function Grid(grid) {
  this.grid = grid;
}
Grid.prototype.placeCard = function (card, x, y) {
  Debug("placeCard : ", card, x, y);
  if (this.grid[x][y].empty || this.grid[x][y].card.value < card.value) {
    this.grid[x][y].card = card;
    this.grid[x][y].empty = false;
    return true;
  }
  return false;
};

Grid.prototype.resetPlacable = function () {
  for (const row of this.grid) {
    for (const column of row) {
      column.placable = false;
    }
  }
};
Grid.prototype.setPlacable = function (color) {
  Debug("setPlacable");
  this.bounds = this.getBounds();
  return new Promise(async (resolve, reject) => {
    for (let rowIndex = 0; rowIndex < this.grid.length; rowIndex++) {
      for (let columnIndex = 0; columnIndex < this.grid.length; columnIndex++) {
        const cell = this.grid[rowIndex][columnIndex];
        cell.placable = false;
        this.setPlacableAroundCell(columnIndex, rowIndex, color);
      }
    }
    resolve();
  });
};

Grid.prototype.getBounds = function () {
  let topLeft = { x: 6, y: 6 };
  let bottomRight = { x: 6, y: 6 };
  for (let y = 0; y < this.grid.length; y++) {
    for (let x = 0; x < this.grid.length; x++) {
      if (!this.grid[y][x].empty) {
        if (x < topLeft.x) {
          topLeft.x = x;
        }
        if (y < topLeft.y) {
          topLeft.y = y;
        }
        if (x > bottomRight.x) {
          bottomRight.x = x;
        }
        if (y > bottomRight.y) {
          bottomRight.y = y;
        }
      }
    }
  }
  return { topLeft: topLeft, bottomRight: bottomRight };
};

Grid.prototype.isThereCardAround = function (x, y) {
  if (y > 0 && !this.grid[y - 1][x].empty) {
    return true;
  }
  if (y < this.grid.length - 1 && !this.grid[y + 1][x].empty) {
    return true;
  }
  if (x > 0 && !this.grid[y][x - 1].empty) {
    return true;
  }
  if (x < this.grid.length - 1 && !this.grid[y][x + 1].empty) {
    return true;
  }
  if (y > 0 && x > 0 && !this.grid[y - 1][x - 1].empty) {
    return true;
  }
  if (y > 0 && x < this.grid.length - 1 && !this.grid[y - 1][x + 1].empty) {
    return true;
  }
  if (y < this.grid.length - 1 && x > 0 && !this.grid[y + 1][x - 1].empty) {
    return true;
  }
  if (
    y < this.grid.length - 1 &&
    x < this.grid.length - 1 &&
    !this.grid[y + 1][x + 1].empty
  ) {
    return true;
  }

  return false;
};

Grid.prototype.setPlacableAroundCell = function (x, y, color) {
  if (!this.grid[y][x].empty) {
    return;
  }
  const isThereCardAround = this.isThereCardAround(x, y);
  let isPlacable = true;
  if (this.bounds.bottomRight.x - this.bounds.topLeft.x >= 5) {
    if (!(x >= this.bounds.topLeft.x && x <= this.bounds.bottomRight.x)) {
      isPlacable = false;
    }
  }
  if (this.bounds.bottomRight.y - this.bounds.topLeft.y >= 5) {
    if (!(y >= this.bounds.topLeft.y && y <= this.bounds.bottomRight.y)) {
      isPlacable = false;
    }
  }
  if (isThereCardAround && isPlacable) {
    this.grid[y][x].placable = true;
  }
};

Grid.prototype.doesUserWin = function (user, count) {
  Debug("doesUserWin", user, count);

  return (
    this.isThereARowOf(user.color, count) ||
    this.isThereAColumnOf(user.color, count) ||
    this.isThereADiagonalOf(user.color, count)
  );
};

Grid.prototype.isThereARowOf = function (color, count) {
  Debug("isThereARowOf", color, count);
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
  Debug("isThereAColumnOf", color, count);
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
  Debug("isThereADiagonalOf", color, count);
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
