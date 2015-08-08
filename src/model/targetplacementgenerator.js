const PriorityQueue = require('priorityqueuejs');
const Unit = require('./unit');

class TargetPlacementGenerator {

  constructor (board, startingUnit, queueLen) {
    this._pq = new PriorityQueue((a, b) => a[0] - b[0]);
    this._queueLen = queueLen;
    this._board = board;

    var target = this._findInitial(board, startingUnit);
    var heuristic = board.boardHeuristic(target);

    this._pq.enq([heuristic, target]);
    this._lastFetched = target;

    this._fetchBatch();
  }

  next() {
    if (this._pq.size() == 0) {
      this._fetchBatch();      
    }

    return this._pq.deq()[1];
  }

  _fetchBatch() {
    var target = this._lastFetched;
    var heuristic;    
    for (var i = 0; i < this._queueLen; i++) {
      target = this._findNext(this._board, target);
      heuristic = this._board.boardHeuristic(target);
      this._pq.enq([heuristic, target]);     

      // console.log('Target ' + JSON.stringify(target.pivot) + ', heuristic ' + heuristic);
    }
    this._lastFetched = target;
  }

  _findInitial(board, unit) {
    var size = unit.getSize();
    var offset = {x: board.width - size.max.x - 1, y: board.height - size.max.y - 1};
    var targetUnit = unit.moveBy(offset);

    if (board.isValidPosition(targetUnit))
      return targetUnit;

    return this._findNext(board, targetUnit);
  }


  _findNext(board, unit) {
    var target = unit.move('W');

    while (!board.isValidPosition(target)) {

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


module.exports = TargetPlacementGenerator;