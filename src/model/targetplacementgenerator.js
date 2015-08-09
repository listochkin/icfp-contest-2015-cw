const PriorityQueue = require('priorityqueuejs');
const Unit = require('./unit');

class TargetPlacementGenerator {

  constructor (board, startingUnit, queueLen, rotate = false) {
    this.created = true;
    this._pq = new PriorityQueue((a, b) => a[0] - b[0]);
    this._queueLen = queueLen;
    this._rotate = rotate;
    this._board = board;
    this._board.floodFill();
    this.hist = this._board.findLinesHistogram();
    this.currentYIndex = 0;
    //console.log("Hist: " + JSON.stringify(this.hist));

    var target = this._findInitial(board, startingUnit);
    if(target == null) {
      this.created = false;
      return;
    }
    var heuristic = board.boardHeuristic(target);

    this._enq(heuristic, target);
    this._lastFetched = target;

    this._fetchBatch();
  }

  next() {
    var hasItems = true;
    if (this._pq.size() == 0) {
      hasItems = this._fetchBatch();
    }

    if(!hasItems)
      return null;
    return this._pq.deq()[1];
  }

  _enq(heuristic, unit) {
    this._pq.enq([heuristic, unit]);
    //console.log('Target ' + JSON.stringify(unit) + ', heuristic ' + heuristic);
  }

  _fetchBatch() {
    var target = this._lastFetched;
    var heuristic;
    var itemsEnqueued = 0;
    var batchSize = this._queueLen - this._pq.size();

    for (var i = 0; i < batchSize; i++) {
      target = this._findNext(this._board, target);
      if (!target)
        break;
      heuristic = this._board.boardHeuristic(target);
      this._enq(heuristic, target);
      itemsEnqueued++;
    }
    this._lastFetched = target;
    if(itemsEnqueued == 0)
      return false;

    return true;
  }


  _findInitial(board, unit) {
    var size = unit.getSize();
    //var offset = {x: board.width - size.max.x - 1, y: board.height - size.max.y - 1};
    var offset = {x: board.width - size.max.x - 1, y: this.hist[this.currentYIndex].y - size.max.y};
    var target = unit.moveBy(offset);

    this._lastMoved = target;

    if (board.isValidPositionPlusFlood(target))
      return target;

    return this._findNext(board, target);
  }


  _findNext(board, unit) {

    if (!unit)
      return null;

    var target = this._nextRotation(board, unit);

    if (!target) {
      target = this._nextLocation(board, this._lastMoved);
      // store moved unit in non-rotated state
      this._lastMoved = target;
    }

    return target;
  }

  _nextRotation(board, unit) {
    if (!this._rotate || unit.rotation == 5)
      return null;

    var target = unit.rotate('CW');

    while (!board.isValidPositionPlusFlood(target)) {
      if (target.rotation == 5)
        return null;

      target = target.rotate('CW');
    }
    return target;
  }

  _nextLocation(board, unit) {
    var target = unit.move('W');

    while (!board.isValidPositionPlusFlood(target)) {

      // console.log("skip " + target);

      // if (target.rotation < 5) {
      //   target = target.move('CW');
      //   continue;
      // }
      var size = target.getSize();
      if (size.min.x > 0)
        target = target.move('W')
      else {
        if (size.min.y <= 0)
          return null;

        // goto next best row
        this.currentYIndex++;
        var offset = {x: board.width - size.max.x - 1, y: this.hist[this.currentYIndex].y - size.max.y};
        target = target.moveBy(offset);
      }
    }
    return target;
  }

}


module.exports = TargetPlacementGenerator;
