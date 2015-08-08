var math = require('mathjs');
var PriorityQueue = require('priorityqueuejs');
const pathevaluator = require('./pathevaluator');

class Game {
  constructor(){
    this.ls_old = 0;
    this.move_score = 0;
    this.old_score = 0;
  }

  isValidPosition (board, unit) {
    return board.isValidPosition(unit);
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


  findTargetPlacementPQ(board, unit) {
    var pq = new PriorityQueue((a, b) => a[0] - b[0]);

    var target = findUnitTargetPlacement(board, unit);
    var heuristic = board.boardHeuristic(target);

    pq.enq([heuristic, target]);

    for (var i = 0; i < 10; i++) {
      target = findNextTargetPlacement(board, unit);
      heuristic = board.boardHeuristic(target);
      pq.enq([heuristic, target]);
    }
    return pq;
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

  reachableLocation(board, unit) { // TODO: checks if unit's location is reachable for current board configuration
    var evaluator = new pathevaluator(board);

    evaluator.proceedEvaluation(this.spawn(board, unit));

    return evaluator.checkReachable(unit);
  }

  moveScoreCount(game){
    this.old_score += parseInt(this.move_score);
    var ls = game.board.getLines().length;
    var size = game.unit.members.length;
    var points = size + 100 * (1 + ls) * ls / 2;
    var line_bonus = 0;
    if(this.ls_old > 1){
      line_bonus = floor ((this.ls_old - 1) * points / 10);
    }
    this.ls_old = ls;
    this.move_score = points + line_bonus;
    return this;
  }
  moveScoreGet(){
    return {
      lines_cleared: this.ls_old,
      current_score: this.move_score,
      old_score: this.old_score,
      move_scores: this.move_score + this.old_score};
  }

}

module.exports = Game;
