class Unit {
  constructor (pivot, members) {
    this.pivot = pivot;
    this.members = members;
  }
  move (direction) {

    var deltaXOdd = 0, deltaXEven = 0, deltaY = 0;
    switch(direction) {
        case 'SW':
          deltaXOdd = 0;
          deltaXEven = -1;
          deltaY = 1;
          break;
        case 'SE':
          deltaXOdd = 1;
          deltaXEven = 0;
          deltaY = 1;
          break;
        case 'W':
          deltaXOdd = -1;
          deltaXEven = -1;
          break;
        case 'E':
          deltaXOdd = 1;
          deltaXEven = 1;
          break;
    }
    var pivot = { x: this.pivot.x + (this.pivot.y%2 ? deltaXOdd : deltaXEven), y: this.pivot.y + deltaY};
    var cells = [];

    this.cells.forEach(function(item, i, arr) {
      cells.push({ x: item.x + ((item.y%2) ? deltaXOdd : deltaXEven), y: item.y + deltaY} );
    });


    return new Unit(pivot, cells);
  }
  rotate (direction) {
    // TODO:
    return new Unit();
  }
  fillBoard (board) {
    for (var i = 0; i < unit.members.length; i++) {
      board.fill(unit.members[i].x, unit.members[i].y);
    }
  }
}

module.exports = Unit;
