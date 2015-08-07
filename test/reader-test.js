const chai = require('chai'),
    assert = chai.assert,
    expect = chai.expect;

const read = require('../src/reader');

// const json = {
//
//   "id": number,              /* A unique number identifying the problem */
//
//   /* The various unit configurations that may appear in this game.
//      There might be multiple entries for the same unit.
//      When a unit is spawned, it will start off in the orientation
//      specified in this field. */
//   "units": [ Unit ],
//
//   "width":  number,          /* The number of cells in a row */
//
//   "height": number,          /* The number of rows on the board */
//
//   "filled": [ Cell ],        /* Which cells start filled */
//
//   "sourceLength": number,    /* How many units in the source */
//
//   "sourceSeeds": [ number ], /* How to generate the source and
//                                 how many games to play */
// };


describe('Simple Tests', () => {
  it('should convert json to a game', function () {
    const problem7 = {"height":20,"width":40,"sourceSeeds":[0,18705,22828,16651,27669],"units":[{"members":[{"x":0,"y":0},{"x":2,"y":0}],"pivot":{"x":1,"y":0}},{"members":[{"x":1,"y":0},{"x":0,"y":1},{"x":0,"y":2}],"pivot":{"x":0,"y":1}},{"members":[{"x":2,"y":0},{"x":1,"y":0},{"x":0,"y":1}],"pivot":{"x":1,"y":0}},{"members":[{"x":1,"y":1},{"x":1,"y":0},{"x":0,"y":1}],"pivot":{"x":0,"y":0}},{"members":[{"x":2,"y":0},{"x":1,"y":1},{"x":1,"y":2},{"x":0,"y":3}],"pivot":{"x":1,"y":1}},{"members":[{"x":2,"y":0},{"x":1,"y":0},{"x":0,"y":1},{"x":0,"y":2}],"pivot":{"x":1,"y":1}},{"members":[{"x":1,"y":1},{"x":1,"y":0},{"x":0,"y":1},{"x":0,"y":2}],"pivot":{"x":0,"y":1}},{"members":[{"x":0,"y":0},{"x":1,"y":0},{"x":0,"y":1},{"x":0,"y":2}],"pivot":{"x":0,"y":1}},{"members":[{"x":1,"y":0},{"x":1,"y":1},{"x":1,"y":2},{"x":0,"y":3}],"pivot":{"x":0,"y":1}},{"members":[{"x":2,"y":0},{"x":1,"y":1},{"x":0,"y":1},{"x":0,"y":2}],"pivot":{"x":1,"y":1}},{"members":[{"x":2,"y":1},{"x":2,"y":0},{"x":1,"y":0},{"x":0,"y":1}],"pivot":{"x":1,"y":0}},{"members":[{"x":1,"y":1},{"x":2,"y":0},{"x":1,"y":0},{"x":0,"y":1}],"pivot":{"x":1,"y":0}},{"members":[{"x":0,"y":0},{"x":0,"y":1},{"x":1,"y":1},{"x":0,"y":2}],"pivot":{"x":0,"y":1}},{"members":[{"x":0,"y":1},{"x":1,"y":1},{"x":3,"y":0},{"x":2,"y":0}],"pivot":{"x":1,"y":0}}],"id":7,"filled":[{"x":0,"y":5},{"x":4,"y":5},{"x":30,"y":5},{"x":34,"y":5},{"x":1,"y":6},{"x":4,"y":6},{"x":30,"y":6},{"x":34,"y":6},{"x":1,"y":7},{"x":3,"y":7},{"x":30,"y":7},{"x":34,"y":7},{"x":2,"y":8},{"x":3,"y":8},{"x":29,"y":8},{"x":30,"y":8},{"x":31,"y":8},{"x":32,"y":8},{"x":34,"y":8},{"x":2,"y":9},{"x":5,"y":9},{"x":9,"y":9},{"x":12,"y":9},{"x":13,"y":9},{"x":14,"y":9},{"x":18,"y":9},{"x":19,"y":9},{"x":20,"y":9},{"x":24,"y":9},{"x":25,"y":9},{"x":26,"y":9},{"x":30,"y":9},{"x":34,"y":9},{"x":35,"y":9},{"x":36,"y":9},{"x":2,"y":10},{"x":6,"y":10},{"x":9,"y":10},{"x":12,"y":10},{"x":15,"y":10},{"x":18,"y":10},{"x":21,"y":10},{"x":24,"y":10},{"x":27,"y":10},{"x":30,"y":10},{"x":34,"y":10},{"x":37,"y":10},{"x":2,"y":11},{"x":5,"y":11},{"x":9,"y":11},{"x":11,"y":11},{"x":15,"y":11},{"x":17,"y":11},{"x":21,"y":11},{"x":23,"y":11},{"x":27,"y":11},{"x":30,"y":11},{"x":34,"y":11},{"x":37,"y":11},{"x":2,"y":12},{"x":6,"y":12},{"x":9,"y":12},{"x":12,"y":12},{"x":15,"y":12},{"x":18,"y":12},{"x":21,"y":12},{"x":24,"y":12},{"x":27,"y":12},{"x":30,"y":12},{"x":34,"y":12},{"x":37,"y":12},{"x":2,"y":13},{"x":6,"y":13},{"x":7,"y":13},{"x":8,"y":13},{"x":12,"y":13},{"x":13,"y":13},{"x":14,"y":13},{"x":15,"y":13},{"x":18,"y":13},{"x":19,"y":13},{"x":20,"y":13},{"x":21,"y":13},{"x":24,"y":13},{"x":25,"y":13},{"x":26,"y":13},{"x":30,"y":13},{"x":31,"y":13},{"x":34,"y":13},{"x":37,"y":13},{"x":15,"y":14},{"x":21,"y":14},{"x":14,"y":15},{"x":20,"y":15},{"x":12,"y":16},{"x":13,"y":16},{"x":14,"y":16},{"x":18,"y":16},{"x":19,"y":16},{"x":20,"y":16}],"sourceLength":100};
    const game = read(problem7);
    assert(game != null);
    assert(game.board != null);
  });
});
