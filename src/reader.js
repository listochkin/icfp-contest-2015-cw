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


  var units = [];
  for (var i = 0; i < problem.units.length; i++) {
    units.push(new Unit(problem.units[i].pivot, problem.units[i].members, i));
  }
  game.setUnits(units);


  return game;
}

module.exports = read;
