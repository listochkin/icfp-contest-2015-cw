class Game {
  isValidPosition (board, unit) {
    // todo
  }
  lock (board, unit) {
    for (var i = 0; i < unit.cells.length; i++) {
      board.fill(unit.cells[i].x, unit.cells[i].y);
    }
  }
}

module.exports = Game;
