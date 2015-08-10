var model = require('./model'),
  Board = model.Board,
  Unit = model.Unit,
  Game = model.Game;

var pathfind = require('./pathfind');


// Now these are the heuristics used to chop off the possible locations
// at the bottom of the glass.

function canMoveUp(board, target) {
  // a bad heuristic the target can be reached: that the unit can move at
  // least somewhere UP from this position.
  ['SW', 'SE'].find(
      d => board.isValidPosition(target.move(d)))
}

/**
 * a bit stronger heuristic the target can be reached: that the unit can
 * move somewhere UP after a single step from this position.
 * @param board
 * @param target
 */
function canMoveUp2Step(board, target) {
  ['W', 'E', 'CW', 'CCW'].find(
      d => {
        var moved = target.move(d);
        return board.isValidPosition(moved) &&
          canMoveUp(board, target.move(d))
      })
}

/**
 * Probably useless, as the placement generator itself provides targets that the solver will validate.
 * @param board
 * @param target
 * @returns {boolean} if the position is reachable from the top of the glass.
 */
function totallyReachable(board, target) {
  // TODO: pathfinder time limit? Maybe use this
  var game = new Game();
  var start = game.spawn(board, target);

  const solution = pathfind(board, start, target);
  return solution.status == 'success';
}

/**
 *
 * @param board
 * @param target
 * @returns how many lines does the @target placement fill.
 */
function fillsLines(board, target) {
  // TODO

}

/**
 * @returns placement iterator with a next() method.
 */
function placement_iterator() {

}
