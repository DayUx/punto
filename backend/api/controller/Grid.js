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
  console.log("doesUserWin", count);

  let win = false;
  for (const color of user.colors) {
    win =
      win ||
      this.isThereARowOf(color, count) ||
      this.isThereAColumnOf(color, count) ||
      this.isThereADiagonalOf(color, count);
  }

  if (win) {
    user.win = true;
    console.log(user.username, "a gagné !!!!!!");
  }

  return win;
};

Grid.prototype.isThereARowOf = function (color, count) {
  Debug("isThereARowOf", color, count);
  for (let i = 0; i < this.grid.length; i++) {
    let x = 0;
    for (let j = 0; j < this.grid.length; j++) {
      if (!this.grid[i][j].empty && this.grid[i][j].card.color === color) {
        x++;
      } else {
        if (x < count) {
          x = 0;
        }
      }
    }
    if (x >= count) {
      return true;
    }
  }
  return false;
};
Grid.prototype.isThereAColumnOf = function (color, count) {
  Debug("isThereAColumnOf", color, count);
  for (let i = 0; i < this.grid.length; i++) {
    let x = 0;
    for (let j = 0; j < this.grid.length; j++) {
      if (!this.grid[j][i].empty && this.grid[j][i].card.color === color) {
        x++;
      } else {
        if (x < count) {
          x = 0;
        }
      }
    }
    if (x >= count) {
      return true;
    }
  }
  return false;
};
Grid.prototype.isThereADiagonalOf = function (color, count) {
  var tailleGrille = this.grid.length;

  for (var i = 0; i <= tailleGrille - count; i++) {
    for (var j = 0; j <= tailleGrille - count; j++) {
      var diagonale = [];
      for (var k = 0; k < count; k++) {
        diagonale.push(this.grid[i + k][j + k]);
      }
      if (diagonale.every((cell) => cell.card?.color == color)) {
        console.log(
          `Il y a une diagonale de ${count} cartes identiques de ${diagonale[0]} dans la grille !`
        );
        return true;
      }
    }
  }

  for (var i = count - 1; i < tailleGrille; i++) {
    for (var j = 0; j <= tailleGrille - count; j++) {
      var diagonale = [];
      for (var k = 0; k < count; k++) {
        diagonale.push(this.grid[i - k][j + k]);
      }
      if (diagonale.every((cell) => cell.card?.color == color)) {
        console.log(
          `Il y a une diagonale de ${count} cartes identiques de ${diagonale[0]} dans la grille !`
        );
        return true;
      }
    }
  }

  // Si aucune diagonale n'a été trouvée, retourne false
  return false;
};

module.exports = Grid;
