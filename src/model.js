class Board {
  constructor (width, height) {
    this.width = width;
    this.height = height;
    this.cells = [];
    for (var i = 0; i< this.height; i++) {
      this.cells.push([]);
      for (var j = 0; j < this.width; j++) {
        this.cells[i][j] = 0;
      };
    }
  }
  get (x, y) {
    return this.cells[y][x];
  }
  fill (x, y) {
    this.cells[y][x] = 1;
    return this;
  }
  clear (x, y) {
    this.cells[y][x] = 0;
    return this;
  }
  clearLine (y) {
    this.cells.splice(y, 1);
    this.cells.unshift([]);
    for (var i = 0; i < this.height; i++) {
      this.cells[0].push(0);
    };
  }
}

module.exports = {
  Board
}
