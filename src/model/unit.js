class Unit {
  constructor (pivot, members) {
    this.pivot = pivot;
    this.members = members;
  }
  move (direction) {
    // TODO:
    return new Unit();
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
