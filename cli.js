require("babel/register"); // don't put anything above this line!
/*
// my-program.js
var nopt = require("nopt")
  , Stream = require("stream").Stream
  , path = require("path")
    , knownOpts = { "foo" : [String, null]
                , "bar" : [Stream, Number]
                , "baz" : path
                , "bloo" : [ "big", "medium", "small" ]
                , "flag" : Boolean
                , "pick" : Boolean
                , "many" : [String, Array]
                }
  , shortHands = { "foofoo" : ["--foo", "Mr. Foo"]
                 , "b7" : ["--bar", "7"]
                 , "m" : ["--bloo", "medium"]
                 , "p" : ["--pick"]
                 , "f" : ["--flag"]
                 }
             // everything is optional.
             // knownOpts and shorthands default to {}
             // arg list defaults to process.argv
             // slice defaults to 2
  , parsed = nopt(knownOpts, shortHands, process.argv, 2)
console.log(parsed)
*/
require("babel/register");
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

var problem7 = {"height":20,"width":40,"sourceSeeds":[0,18705,22828,16651,27669],"units":[{"members":[{"x":0,"y":0},{"x":2,"y":0}],"pivot":{"x":1,"y":0}},{"members":[{"x":1,"y":0},{"x":0,"y":1},{"x":0,"y":2}],"pivot":{"x":0,"y":1}},{"members":[{"x":2,"y":0},{"x":1,"y":0},{"x":0,"y":1}],"pivot":{"x":1,"y":0}},{"members":[{"x":1,"y":1},{"x":1,"y":0},{"x":0,"y":1}],"pivot":{"x":0,"y":0}},{"members":[{"x":2,"y":0},{"x":1,"y":1},{"x":1,"y":2},{"x":0,"y":3}],"pivot":{"x":1,"y":1}},{"members":[{"x":2,"y":0},{"x":1,"y":0},{"x":0,"y":1},{"x":0,"y":2}],"pivot":{"x":1,"y":1}},{"members":[{"x":1,"y":1},{"x":1,"y":0},{"x":0,"y":1},{"x":0,"y":2}],"pivot":{"x":0,"y":1}},{"members":[{"x":0,"y":0},{"x":1,"y":0},{"x":0,"y":1},{"x":0,"y":2}],"pivot":{"x":0,"y":1}},{"members":[{"x":1,"y":0},{"x":1,"y":1},{"x":1,"y":2},{"x":0,"y":3}],"pivot":{"x":0,"y":1}},{"members":[{"x":2,"y":0},{"x":1,"y":1},{"x":0,"y":1},{"x":0,"y":2}],"pivot":{"x":1,"y":1}},{"members":[{"x":2,"y":1},{"x":2,"y":0},{"x":1,"y":0},{"x":0,"y":1}],"pivot":{"x":1,"y":0}},{"members":[{"x":1,"y":1},{"x":2,"y":0},{"x":1,"y":0},{"x":0,"y":1}],"pivot":{"x":1,"y":0}},{"members":[{"x":0,"y":0},{"x":0,"y":1},{"x":1,"y":1},{"x":0,"y":2}],"pivot":{"x":0,"y":1}},{"members":[{"x":0,"y":1},{"x":1,"y":1},{"x":3,"y":0},{"x":2,"y":0}],"pivot":{"x":1,"y":0}}],"id":7,"filled":[{"x":0,"y":5},{"x":4,"y":5},{"x":30,"y":5},{"x":34,"y":5},{"x":1,"y":6},{"x":4,"y":6},{"x":30,"y":6},{"x":34,"y":6},{"x":1,"y":7},{"x":3,"y":7},{"x":30,"y":7},{"x":34,"y":7},{"x":2,"y":8},{"x":3,"y":8},{"x":29,"y":8},{"x":30,"y":8},{"x":31,"y":8},{"x":32,"y":8},{"x":34,"y":8},{"x":2,"y":9},{"x":5,"y":9},{"x":9,"y":9},{"x":12,"y":9},{"x":13,"y":9},{"x":14,"y":9},{"x":18,"y":9},{"x":19,"y":9},{"x":20,"y":9},{"x":24,"y":9},{"x":25,"y":9},{"x":26,"y":9},{"x":30,"y":9},{"x":34,"y":9},{"x":35,"y":9},{"x":36,"y":9},{"x":2,"y":10},{"x":6,"y":10},{"x":9,"y":10},{"x":12,"y":10},{"x":15,"y":10},{"x":18,"y":10},{"x":21,"y":10},{"x":24,"y":10},{"x":27,"y":10},{"x":30,"y":10},{"x":34,"y":10},{"x":37,"y":10},{"x":2,"y":11},{"x":5,"y":11},{"x":9,"y":11},{"x":11,"y":11},{"x":15,"y":11},{"x":17,"y":11},{"x":21,"y":11},{"x":23,"y":11},{"x":27,"y":11},{"x":30,"y":11},{"x":34,"y":11},{"x":37,"y":11},{"x":2,"y":12},{"x":6,"y":12},{"x":9,"y":12},{"x":12,"y":12},{"x":15,"y":12},{"x":18,"y":12},{"x":21,"y":12},{"x":24,"y":12},{"x":27,"y":12},{"x":30,"y":12},{"x":34,"y":12},{"x":37,"y":12},{"x":2,"y":13},{"x":6,"y":13},{"x":7,"y":13},{"x":8,"y":13},{"x":12,"y":13},{"x":13,"y":13},{"x":14,"y":13},{"x":15,"y":13},{"x":18,"y":13},{"x":19,"y":13},{"x":20,"y":13},{"x":21,"y":13},{"x":24,"y":13},{"x":25,"y":13},{"x":26,"y":13},{"x":30,"y":13},{"x":31,"y":13},{"x":34,"y":13},{"x":37,"y":13},{"x":15,"y":14},{"x":21,"y":14},{"x":14,"y":15},{"x":20,"y":15},{"x":12,"y":16},{"x":13,"y":16},{"x":14,"y":16},{"x":18,"y":16},{"x":19,"y":16},{"x":20,"y":16}],"sourceLength":100};
var game = read(problem7);
game.unit = game.spawn(game.board, new Unit({ x: 5, y: 0}, [{ x:  0, y: 0}, {x: 2, y: 0}, {x: 3, y: 0}, {x: 2, y: 1}, {x: 7, y: 2}]));
//game.unit = new Unit({ x: 1, y: 0}, [{ x:  0, y: 0}, {x: 2, y: 0}, {x: 3, y: 0}, {x: 2, y: 1}, {x: 2, y: 2}]);
game.display();

console.log("\nSuccess");
