class Board {
  constructor (width, height) {
    this.cells = [];
    for (var i = 0; i< width; i++) {
      this.cells.push([]);
      for (var j = 0; j < height; j++) {
        this.cells[i][j] = 0;
      };
    }
  }
  get (x, y) {
    return this.cells[x][y];
  }
  fill (x, y) {
    this.cells[x][y] = 1;
    return this;
  }
}

module.exports = {
  Board
}
