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
  fillByUnit (unit) {
    var ref = this;
    unit.getMembers().forEach(function(item, i, arr) {
      ref.cells[item.y][item.x] = 1;
    });
  }
  clear (x, y) {
    this.cells[y][x] = 0;
    return this;
  }
  clearLine (y) {
    this.cells.splice(y, 1);
    this.cells.unshift([]);
    for (var i = 0; i < this.width; i++) {
      this.cells[0].push(0);
    };
  }
  getLines () {
    var res = [];
    for (var y = 0; y < this.height; y++) {
      var isLine = true;
      for (var x = 0; x < this.width; x++) {
        if (this.cells[y][x] == 0) {
          isLine = false;
          break;
        };
      };
      if (isLine) {
        res.push(y);
      };
    };
    return res;
  }
  clearLines () {
    var lines = this.getLines();
    for (var i = 0; i < lines.length; i++) {
      this.clearLine(lines[i]);
    }
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

  display() {
    for (var i = 0; i< this.height; i++) {
      var line = i%2 ? ' ' : '';
      for (var j = 0; j < this.width; j++) {
        line += (this.cells[i][j] ? '#' : 'В·') + ' ';
      };
      console.log(line);
    }
  }

  isValidPosition (unit) {

    let valid = true;

    for (var i = 0; valid && i < unit.members.length; i++) {

      var member = {
        x: unit.members[i].x,
        y: unit.members[i].y
      }

      // check that member is within board bounds
      if (member.x < 0 || member.x >= this.width) {
        return false;
      }

      if (member.y < 0 || member.y >= this.height) {
        return false;
      }

      // check that member is on free board cell
      valid = valid && !this.get(member.x, member.y);
    }
    return valid;
  }


  applyUnit(leftTopPoint, unit) {

  }

  lower_line_maximum(unit) {
    var unit_size = unit.getSize();
    for (var j = 0; j < this.width; j++) {
      for(var i = (this.height -1); i >= (unit_size.y -1); i--) {

      }
    };
  }

  aggregateHeight() {
    var sum = 0;
    for (var x = 0; x < this.width; x++) {
      for (var y = 0; y < this.height; y++) {
        if (this.get(x, y)) {
          sum += this.height - y;
          break;
        }
      }
    }
    return sum;
  }

  completeLines() {
    var lines = 0;
    for (var y = 0; y < this.height; y++) {
      if (this.cells[y].findIndex(e => e==0) == -1) {
        lines++;
      }
    }
    return lines;
  }

  holes() {
    var holes = 0;
    for (var x = 0; x < this.width; x++) {
      for (var y = 1; y < this.height; y++) {
        if (this.cells[y][x] == 0 && this.cells[y-1][x] == 1)
          holes++;
      }
    }

    return holes;
  }

  boardHeuristic() {
    const a = -0.51;
    const b = 0.76;
    const c = -0.35;

    return a*this.aggregateHeight() + b*this.completeLines() + c*this.holes();
  }
}

module.exports = Board;
