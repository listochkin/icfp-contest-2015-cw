const { Game, Board, Unit } = require('./model');

function read (problem) {
  if (typeof problem === 'string') {
    problem = JSON.parse(problem);
  }

  const game = new Game();

  const board = new Board(problem.width, problem.height);
  problem.filled.forEach(({ x, y }) => board.fill(x, y));
  game.board = board;

  game.sourceLength = problem.sourceLength;
  game.sourceSeeds = problem.sourceSeeds;

  game.units = problem.units.map(({ pivot, members }) => new Unit(pivot, members));

  return game;
}

module.exports = read;
