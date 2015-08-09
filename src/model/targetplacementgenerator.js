const PriorityQueue = require('priorityqueuejs');
const Unit = require('./unit');

class TargetPlacementGenerator {

  constructor (board, startingUnit, queueLen, rotate = false, game = null) {
    this.created = true;
    this._pq = new PriorityQueue((a, b) => a[0] - b[0]);
    this._queueLen = queueLen;
    this._rotate = rotate;
    this._board = board;
    this._game = game;
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
    var target = unit.moveBy(size.max, {x: board.width - 1, y: this.hist[this.currentYIndex].y});


    this._lastMoved = target;

    if (board.isValidPositionPlusFlood(target))
      return target;

    return this._findNext(board, target);
  }


  _findNext(board, unit) {

    if (!unit)
      return null;

    var target = unit;

    do {
      target = this._nextRotation(board, target);

      if (!target) {
        target = this._nextLocation(board, this._lastMoved);
        // store moved unit in non-rotated state
        this._lastMoved = target;
        //console.log('Moved ' + JSON.stringify(target));
      }
    }
    while (target != null && !board.isValidPositionPlusFlood(target));

    return target;
  }

  _nextRotation(board, unit) {
    if (!this._rotate)
      return null;

    var nextRotation = unit;
    do {
      if (nextRotation.rotation >= 5)
        return null;

      nextRotation = nextRotation.rotate('CW');

    } while(this._game && !this._game.unitRotations[nextRotation.id][nextRotation.rotation] && nextRotation.rotation < 6);

    return nextRotation;
  }

  _nextLocation(board, unit) {

    var size = unit.getSize();

    if (size.min.x > 0)
      return unit.move('W')

    else {
      if (size.min.y <= 0)
        return null;

      // goto next best row

      this.currentYIndex++;
      //console.log("Hist curind: " + this.currentYIndex+ " y="+this.hist[this.currentYIndex].y);
      return unit.moveBy(size.max, {x: board.width - 1, y: this.hist[this.currentYIndex].y});
    }
  }
}


module.exports = TargetPlacementGenerator;
