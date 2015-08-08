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


describe('A* test', () => {
  it('should find a path', () => {
    var pathfind = require('../src/pathfind');
    // . @ .
    //  . # .
    // . X .
    const board = new Board(3, 3);
    board.fill(1, 1); // #
    const start = { x: 1, y: 0 }; //@
    const finish = { x: 1, y: 2 }; // X

    const unit = new Unit(start, [start]);

    const path = pathfind(board, unit, start, finish);

    console.log(path);
    expect(path.status).to.equal('success');
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
