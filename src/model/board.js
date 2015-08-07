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

  getRandomGenerator (seed) {
    var multiplier = 1103515245;
    var increment = 12345;

    var mulA = multiplier >>> 16;
    var mulB = multiplier & 0xffff;

    var sA = seed >>> 16;
    var sB = seed & 0xffff;

    var result = 0;
    var prng = function () {
      var oldres = result;

      var rB = mulA*sB + mulB*sA;
      var rC = mulB*sB + increment;
      sA = (rB + (rC >>> 16)) & 0xffff;
      sB = rC & 0xffff;
      result = sA & 0x7fff;

      return oldres;
    };
    return prng;
  }
}


module.exports = {
  Board
}
