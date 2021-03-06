const PriorityQueue = require('priorityqueuejs');
const Unit = require('./unit');

class TargetPlacementGenerator {

  constructor (board, startingUnit, queueLen, rotate = false, game = null, queueThreshold = 1, debug = false) {
    this.created = true;
    this._pq = new PriorityQueue((a, b) => a[0] - b[0]);
    this._queueLen = queueLen;
    this._queueItemsToPick = queueLen * queueThreshold >= 1 ? queueLen * queueThreshold : 1;
    this._pickedItemsCount = 0;
    this._rotate = rotate;
    this._board = board;
    this._game = game;
    this._board.floodFill();
    this.hist = this._board.findLinesHistogram();
    this.currentYIndex = 0;
    this._debug = debug;
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
    if (this._pq.size() == 0 || this._pickedItemsCount == this._queueItemsToPick) {
      this._removeQueueRemainingItems();
      this._pickedItemsCount = 0;
      hasItems = this._fetchBatch();
    }

    if(!hasItems)
      return null;

    this._pickedItemsCount++;
    return this._pq.deq()[1];
  }

  _removeQueueRemainingItems() {
    while(this._pq.size() > 0) {
      this._pq.deq();
    }
  }

  _enq(heuristic, unit) {
    this._pq.enq([heuristic, unit]);

    if (this._debug) {

      var boardCells = JSON.stringify(this._board.cells);

      this._board.fillByUnit(unit);
      this._board.clearLines();

      var ag = this._board.aggregateHeight();
      var cl = this._board.completeLines();
      var hl = this._board.holes();
      var bm = this._board.bumpiness();

      this._board.cells = JSON.parse(boardCells);

      console.log('Enqueued target ' + JSON.stringify(unit) + ', heuristic ' + heuristic);
      console.log('Aggr H ' + ag + ', Compl L ' + cl + ', Holes ' + hl + ', Bumpiness ' + bm);
      this._game.board = this._board;
      this._game.unit = unit;
      this._game.display();
    }
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
    // var size = unit.getSize();
    //var target = unit.moveBy({x: size.min.x, y: size.max.y}, {x: board.width - 1, y: this.hist[this.currentYIndex].y});
    var target = this._moveUnitTo(unit, {x: board.width - 1, y: this.hist[this.currentYIndex].y});

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
      }
      // console.log('Check target ' + JSON.stringify(target));
    }
    while (target != null && !board.isValidPositionPlusFlood(target));

    return target;
  }

  _nextRotation(board, unit) {
    if (!this._rotate)
      return null;

    var size = unit.getSize();
    var nextRotation = unit;

    do {
      if (nextRotation.rotation >= 5)
        return null;

      nextRotation = nextRotation.rotateWithCenter(size.center, 'CW');
      // nextRotation = nextRotation.rotate('CW');

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
      //return unit.moveBy({x: size.min.x, y: size.max.y}, {x: board.width - 1, y: this.hist[this.currentYIndex].y});
      return this._moveUnitTo(unit, {x: board.width - 1, y: this.hist[this.currentYIndex].y});
    }
  }

  _moveUnitTo(unit, point) {
    var size = unit.getSize();
    var movedByY = unit.moveBy(size.center, {x: size.center.x, y: point.y});
    size = movedByY.getSize();
    return movedByY.moveBy(size.center, {x: point.x, y: size.center.y});
  }

}


module.exports = TargetPlacementGenerator;
