var model = require('./src/model'),
  Board = model.Board,
  Unit = model.Unit,
  Game = model.Game;
var read = require('./src/reader');

/*
var board = new Board(5, 7);
board.fill(2, 3);
board.display();
*/

var problem7 = {"height":10,"width":10,"sourceSeeds":[0],"units":[{"members":[{"x":0,"y":0}],"pivot":{"x":0,"y":0}},{"members":[{"x":0,"y":0},{"x":2,"y":0}],"pivot":{"x":1,"y":0}},{"members":[{"x":0,"y":0},{"x":0,"y":2}],"pivot":{"x":0,"y":1}},{"members":[{"x":2,"y":0},{"x":0,"y":1},{"x":2,"y":2}],"pivot":{"x":1,"y":1}},{"members":[{"x":0,"y":0},{"x":1,"y":1},{"x":0,"y":2}],"pivot":{"x":0,"y":1}},{"members":[{"x":0,"y":0},{"x":1,"y":0}],"pivot":{"x":0,"y":0}},{"members":[{"x":0,"y":0},{"x":1,"y":0}],"pivot":{"x":1,"y":0}},{"members":[{"x":0,"y":0},{"x":0,"y":1}],"pivot":{"x":0,"y":0}},{"members":[{"x":0,"y":0},{"x":0,"y":1}],"pivot":{"x":0,"y":1}},{"members":[{"x":0,"y":0},{"x":1,"y":0},{"x":2,"y":0}],"pivot":{"x":0,"y":0}},{"members":[{"x":0,"y":0},{"x":1,"y":0},{"x":2,"y":0}],"pivot":{"x":1,"y":0}},{"members":[{"x":0,"y":0},{"x":1,"y":0},{"x":2,"y":0}],"pivot":{"x":2,"y":0}},{"members":[{"x":0,"y":0},{"x":0,"y":1},{"x":0,"y":2}],"pivot":{"x":0,"y":0}},{"members":[{"x":0,"y":0},{"x":0,"y":1},{"x":0,"y":2}],"pivot":{"x":0,"y":1}},{"members":[{"x":0,"y":0},{"x":0,"y":1},{"x":0,"y":2}],"pivot":{"x":0,"y":2}},{"members":[{"x":1,"y":0},{"x":0,"y":1},{"x":1,"y":2}],"pivot":{"x":1,"y":0}},{"members":[{"x":1,"y":0},{"x":0,"y":1},{"x":1,"y":2}],"pivot":{"x":1,"y":1}},{"members":[{"x":1,"y":0},{"x":0,"y":1},{"x":1,"y":2}],"pivot":{"x":1,"y":2}}],"id":0,"filled":[],"sourceLength":100};
var game = read(problem7);
game.unit = game.spawn(game.board, new Unit({ x: 5, y: 0}, [{ x:  0, y: 0}, {x: 2, y: 0}, {x: 3, y: 0}, {x: 2, y: 1}, {x: 7, y: 2}]));
//game.unit = new Unit({ x: 1, y: 0}, [{ x:  0, y: 0}, {x: 2, y: 0}, {x: 3, y: 0}, {x: 2, y: 1}, {x: 2, y: 2}]);
game.display();
