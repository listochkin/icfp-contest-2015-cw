class Game {
  isValidPosition (board, unit) {

    let valid = true;

    for (var i = 0; valid && i < unit.members.length; i++) {

      var member = {
        x: unit.pivot.x + unit.members[i].x,
        y: unit.pivot.y + unit.members[i].y
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
    unit.fillBoard(board);
  }
}

module.exports = Game;
