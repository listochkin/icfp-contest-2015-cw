var math = require('mathjs');
class Game {
  isValidPosition (board, unit) {

    let valid = true;

    for (var i = 0; valid && i < unit.members.length; i++) {

      var member = {
        x: unit.members[i].x,
        y: unit.members[i].y
      }

      // check that member is within board bounds
      if (member.x < 0 || member.x >= board.width) {
        return false;
      }

      if (member.y < 0 || member.y >= board.height) {
        return false;
      }

      // check that member is on free board cell
      valid = valid && !board.get(member.x, member.y);
    }
    return valid;
  }

  lock (board, unit) {
    board.fillByUnit(unit);
    return board;
  }

  display() {
    for (var i = 0; i< this.board.height; i++) {
      var line = i%2 ? ' ' : '';
      for (var j = 0; j < this.board.width; j++) {

        var pivotHere = this.unit && this.unit.pivot.x == j && this.unit.pivot.y == i;
        var unitHere = false;
        if(this.unit)
            for (var k = 0; k < this.unit.members.length; k++) {
                if(this.unit.members[k].x == j && this.unit.members[k].y == i) {
                     unitHere = true;
                     break;
                }
            }

        line += (unitHere ? ( pivotHere ? '@' : '*') : pivotHere ? '+' : (this.board.cells[i][j] ? '#' : '.')) + ' ';
      };
      console.log(line);
    }
  }

spawn (board, unit) {
    var unit_size = unit.getSize();
    var shift = {x: 0};
    shift.x = math.floor((board.width - unit_size.x)/2);
    for (var i = 0; i < unit.members.length; i++) {
      unit.members[i].x += shift.x - unit_size.min.x;
      unit.members[i].y -= unit_size.min.y;
      if((unit.members[i].x < 0) || (unit.members[i].y >= board.height)) {
        console.log('Error: Unit is bigger than field');
        return false;
      }
    }
    unit.pivot.x += shift.x  - unit_size.min.x;
    unit.pivot.y -= unit_size.min.y;

    return unit;
  }


  findUnitTargetPlacement(board, unit) {
    var size = unit.getSize();
    var offset = {x: board.width - size.max.x - 1, y: board.height - size.max.y - 1};
    var targetUnit = unit.moveBy(offset);

    if (this.isValidPosition(board, targetUnit))
      return targetUnit;

    return this.findNextTargetPlacement(board, targetUnit);
  }


  findNextTargetPlacement(board, unit) {
    var target = unit.move('W');

    while (!this.isValidPosition(board, target)) {

      var size = target.getSize();
      if (size.min.x > 0)
        target = target.move('W');
      else {
        // move target one row up
        target = target.moveBy({x: board.width - size.max.x - 1, y: -1});
      }
    }
    return target;
  }


}

module.exports = Game;
