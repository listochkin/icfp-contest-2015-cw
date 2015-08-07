class Game {
  isValidPosition (board, unit) {
    // todo
  }
  lock (board, unit) {
    unit.fillBoard(board);
    return board;
  }
}

module.exports = Game;
