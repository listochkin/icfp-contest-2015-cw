var math = require('mathjs');

class Board {
  constructor (width, height) {
    this.a = -0.51;
//    const b = 0.76;
    this.b = 2.00;
    this.c = -0.35;

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
  getFloodFill(x, y) {
    return this.flood[y][x];
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

  clearByUnit (unit) {
    var ref = this;
    unit.getMembers().forEach(function(item, i, arr) {
      ref.cells[item.y][item.x] = 0;
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

  isValidPositionPlusFlood(unit) {

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

      //if(!this.getFloodFill(member.x, member.y) && unit.members.length > 1) return false;
      if(!this.getFloodFill(member.x, member.y) && ((unit.minPivotDistance() < 2) || !unit.oneDirectionFromPivot())) return false;
    }
    return valid;
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

  findLinesHistogram() {
    var hist = [];
    for (var y = 0; y < this.height; y++) {
      hist[y] = {y: y, filled : 0};
      for (var x = 0; x < this.width; x++) {
        if(this.cells[y][x] == 1)
          hist[y].filled++;
      }
    }
    var k = 2.5;
    var width = this.width;
    var height = this.height;
    hist.sort(function(a, b) {
      var acost = a.y/height + k*a.filled/width;
      var bcost = b.y/height + k*b.filled/width;
      return acost > bcost ? -1 : (acost < bcost ? 1 : 0); 
    })    
    return hist;
  }


  setHeuristicParameters(a, b, c) { // not used for now - to be used by improver
    this.a = a;
    this.b = b;
    this.c = c;
  }

  boardHeuristic(targetUnit) {

    this.fillByUnit(targetUnit);
    var heuristic = this.a*this.aggregateHeight() + this.b*this.completeLines() + this.c*this.holes();
    this.clearByUnit(targetUnit);

//    console.log(heuristic);
    return heuristic;
  }

  floodFill() {
    this.flood = [];
    for (var i = 0; i< this.height; i++) {
      this.flood.push([]);
      for (var j = 0; j < this.width; j++) {
        this.flood[i][j] = 0;
      };
    }
    var fringes = [{x : Math.floor(this.width/2), y: 0}];
    this.flood[0][Math.floor(this.width/2)] = 1;

    var it;
    var x, y;
    //var count = 0;
    while((it = fringes.shift())) {
      //console.log(it);

      x = it.x + 1;
      y = it.y;
      if(!this.flood[y][x] && !this.cells[y][x] && x < this.width) {
        //console.log("1");
        fringes.push({x : x, y: y});
        this.flood[y][x] = 1;
      }
      x = it.x - 1;
      if(!this.flood[y][x] && !this.cells[y][x] && x >= 0) {
        //console.log("2");
        fringes.push({x : x, y: y});
        this.flood[y][x] = 1;
      }
      y = it.y + 1;
      if(y < this.height) {
        x = it.x
        if(!this.flood[y][x] && !this.cells[y][x] && x >= 0) {
          fringes.push({x : x, y: y});
          this.flood[y][x] = 1;
        }

        if(it.y%2) {
          x = it.x + 1;
          if(!this.flood[y][x] && !this.cells[y][x] && x < this.width) {
            fringes.push({x : x, y: y});
            this.flood[y][x] = 1;
          }
        }
        else {
          x = it.x - 1;
          if(!this.flood[y][x] && !this.cells[y][x] && x >= 0) {
            fringes.push({x : x, y: y});
            this.flood[y][x] = 1;
          }
        }
      }
    }
  }
}

module.exports = Board;
