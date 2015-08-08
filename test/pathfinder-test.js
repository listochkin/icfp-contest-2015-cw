const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect;

const Hex = require('../src/hex');

const { Board, Unit, Game, Pathfinder } = require('../src/model');

// not working for Objects 8(((
function set_subtract(from, what) {
  return from.filter(i => what.indexOf(i) < 0);
}

describe.skip('Graph', () => {

  it('needs to determine actual neighbor directions', () => {
    console.log('Trying directions');
    var board = new Board(3, 3);
    var center_neighbors = [
      {x:2, y:1}, {x:2, y:0},
      {x:1, y:0}, {x:0, y:1},
      {x:1, y:2}, {x:2, y:2}
    ];
    var center_directions = [ 'E', 'NE', 'NW', 'W', 'SW', 'SE' ];

    const center = {x: 1, y: 1};
    var unit = new Unit(center, [center]);
    var graph = new Pathfinder.Graph(board, unit);

    var neighbors = graph.neighbors(center);
    expect(neighbors).to.deep.equal(center_neighbors);

    [0,1,2,3,4,5].forEach(d => {
      var cell = center_neighbors[d];
      board.fill(cell.x, cell.y);
      neighbors = graph.neighbors(center);
      var missing = set_subtract(center_neighbors, neighbors);

      console.log('Direction: ' + center_directions[d] + ' cell: ' + missing[0]);

      board.clear(cell.x, cell.y);
      expect(missing.length).to.equal(1);
      expect(missing[0]).to.deep.equal(cell);

    });
  });

  describe('neighbors', () => {

    it('should account for occupied cells', () => {
      var board = new Board(3, 3);
      board.fill(1, 2);
      const center = {x: 1, y: 1};
      var unit = new Unit(center, [center]);
      var graph = new Pathfinder.Graph(board, unit);

      var neighbors = graph.neighbors(center);
      var expected = [
        {x:2, y:1}, {x:2, y:0},
        {x:1, y:0}, {x:0, y:1},
        //{x:1, y:2},
        {x:2, y:2}
      ];
      expect(neighbors).to.deep.equal(expected);

      board.fill(2, 1);
      board.fill(2, 0);
      neighbors = graph.neighbors(center);
      expect(neighbors).to.deep.equal([
        //{x:2, y:1}, {x:2, y:0},
        {x:1, y:0}, {x:0, y:1},
        //{x:1, y:2},
        {x:2, y:2}
      ]);

      board.fill(2, 2);
      neighbors = graph.neighbors(center);
      expect(neighbors).to.deep.equal([
        //{x:2, y:1}, {x:2, y:0},
        {x:1, y:0}, {x:0, y:1}
        //{x:1, y:2},
        //{x:2, y:2}
      ]);
    });
  });
});

    // start - the start node
    // isEnd - function(node) that returns whether a node is an acceptable end
    // neighbor - function(node) that returns an array of neighbors for a node
    // distance - function(a, b) that returns the distance cost between two nodes
    // heuristic - function(node) that returns a heuristic guess of the cost from node to an end.
    // hash - function(node) that returns a unique string for a node. this is so that we can put nodes in heap and set data structures which are based on plain old JavaScript objects. Defaults to using node.toString.
    // timeout - optional limit to amount of milliseconds to search before returning null.


function parse_map_array(map_array) {
  //map_array = [
  // ". @ .",
  //  ". # .",
  // ". X ."
  //];

  var board = new Board((map_array[0].length+1) / 2, map_array.length);
  var start = null;
  var finish = null;
  var pivot = null;
  var members = [];

  for (var y=0; y<board.height; y++) {
    for (var x=0; x<board.width; x++) {

      const cell = map_array[y].charAt(x * 2);
      if (cell == '.') {
        // noop
      } else if (cell == '#') {
        board.fill(x, y);
      } else if (cell == '@') {
        start = { x: x, y: y };
        pivot = start;
        members.push(start);
      } else if (cell == '+') {
        start = { x: x, y: y };
        pivot = start;
      } else if (cell == '*') {
        members.push({ x: x, y: y });
      } else if (cell == 'X') {
        finish = { x: x, y: y };
      } else {
        throw Error('Bad map at ' + x + ',' + y);
      }
    }
  }

  var unit = null;
  if (pivot && members) {
    unit = new Unit(pivot, members);
  }
  //return {
  //  board: board,
  //  start: start,
  //  finish: finish
  //  unit: unit;
  //}
  return [board, start, finish, unit]
}


describe('A* test', () => {
  it('should find a path', () => {
    var pathfind = require('../src/pathfind');

    const map_array = [
      ". @ .",
       ". # .",
      ". X ."
    ];

    const [board, start, finish, unit] = parse_map_array(map_array);
    const path = pathfind(board, unit, start, finish);

    //console.log(path.commands);
    expect(path.status).to.equal('success');
    expect(path.commands).to.deep.equal(['SW', 'SE']);
    expect(path.cost).to.equal(2);
  });

  it('should fail with no path', () => {
    var pathfind = require('../src/pathfind');

    const map_array = [
      ". @ .",
       "# # #",
      ". X ."
    ];

    const [board, start, finish, unit] = parse_map_array(map_array);
    const path = pathfind(board, unit, start, finish);

    expect(path.status).to.equal('noPath');
  });

  it('should find a path when needs to turn to squeeze (I expect this to fail)', () => {
    var pathfind = require('../src/pathfind');

    const map_array = [
      ". @ *",
       "# . #",
      ". X .",
       ". . ."
    ];

    const [board, start, finish, unit] = parse_map_array(map_array);
    const path = pathfind(board, unit, start, finish);

    expect(path.status).to.equal('success');
    expect(path.commands).to.deep.equal(['CW', 'SE', 'SW']);
    expect(path.cost).to.equal(3);
  });

  it('should find a path with pivot outside of the glass', () => {
    var pathfind = require('../src/pathfind');

    const map_array = [
      "+ . * .",
       ". # # #",
      ". X . ."
    ];

    const [board, start, finish, unit] = parse_map_array(map_array);
    const path = pathfind(board, unit, start, finish);

    expect(path.status).to.equal('success');
    expect(path.commands).to.deep.equal(['W', 'SW', 'SE', 'E', 'E']);
    expect(path.cost).to.equal(5);
  });

  it('should find a path rotating different ways', () => {
    var pathfind = require('../src/pathfind');

    const map_array = [
      "* + * .",
       ". . . .",
      "# # . #",
       "# # . #",
      ". . . .",
       ". . . .",
      ". . . .",
       ". # . #",
      ". # . #",
       ". X . #"
    ];

    const [board, start, finish, unit] = parse_map_array(map_array);
    const path = pathfind(board, unit, start, finish);

    expect(path.status).to.equal('success');
    expect(path.commands).to.deep.equal(['SE', 'CW', 'SE', 'SE', 'SE', 'SW', 'SW', 'SW', 'SW', 'CCW', 'SE']);
    expect(path.cost).to.equal(11);
  });


  it('should find a path on a harder map', () => {
    var pathfind = require('../src/pathfind');

    const map_array = [
      ". @ . . . . .",
       ". . . . . . .",
      ". . . . . . .",
       "# # # # # . .",
      ". . . . . # .",
       ". . . X . . .",
      ". . . . . . .",
       ". . . . . . ."
    ];

    const [board, start, finish, unit] = parse_map_array(map_array);
    const path = pathfind(board, unit, start, finish);

    //console.log(path.commands);
    expect(path.status).to.equal('success');
    expect(path.cost).to.equal(10);
  });

  it('should have some rollercoaster', () => {
    var pathfind = require('../src/pathfind');

    const map_array = [
      ". @ . . . . .",
       ". # # # # # #",
      ". . . . . . .",
       "# # # # # # .",
      ". # . # . . .",
       ". . . . # . .",
      ". # # # # # .",
       ". . . . X # #"
    ];

    const [board, start, finish] = parse_map_array(map_array);
    const unit = new Unit(start, [start]);
    const path = pathfind(board, unit, start, finish);

    //console.log(path.commands);
    expect(path.status).to.equal('success');
    expect(path.cost).to.equal(21);
  })

});

describe.skip('A* pathfinder', () => {
  describe('heuristic', () => {
    it('should return the distance between cells', () => {
      // TODO
      assert.fail();
    });
  });

  describe('calc', () => {
    it('should actually return the came_from array', () => {
      // .@.
      // .#.
      // .X.
      const board = new Board(3, 3);
      board.fill(1, 1); // #
      const start = {x: 0, y: 1}; //@
      const finish = { x: 2, y: 1 }; // X

      const unit = new Unit(start, [start]);

      const aStar = new Pathfinder.AStar(board, unit, start, finish);

      const result = aStar.calc();
      console.log(result);
    });
  });
});
