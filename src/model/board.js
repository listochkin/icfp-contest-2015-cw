class Game {
  isValidPosition (board, unit) {
    // todo
  }
  lock (board, unit) {
    // todo
  }
}

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

class Unit {
  constructor (pivot, cells) {
    this.pivot = pivot;
    this.cells = cells;
  }
  move (direction) {
    // TODO:
    return new Unit();
  }
  rotate (direction) {
    // TODO:
    return new Unit();
  }
}

Unit._rotate_cell = (c, direction) => {
  // http://gamedev.stackexchange.com/a/55493/9309
  // http://www.redblobgames.com/grids/hexagons/#rotation
  // odd-r offset to cube
  var x = c.y - (c.x - (c.x&1)) / 2;
  var z = c.x;
  var y = -x-z;

  if (direction == 'CW') {
    // TODO: check if it's the right direction.
    [x, y, z] = [-z, -x, -y];
  } else if (direction == 'CCW') {
    [x, y, z] = [-y, -z, -x];
  } else {
    throw new Error('Bad rotation direction');
  }

  // cube to odd-r
  var col = x + (z - (z&1)) / 2;
  var row = z;

  return {x: row, y: col}
}

module.exports = {
  Board, Unit, Game
}
