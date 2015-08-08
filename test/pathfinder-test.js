const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect;

const Hex = require('../src/hex');

const { Board, Unit, Game, Pathfinder } = require('../src/model');

describe.skip('Graph', () => {
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
  const aStar = require('a-star');
  it('should find a path', () => {
    // . @ .
    //  . # .
    // . X .
    const board = new Board(3, 3);
    board.fill(1, 1); // #
    const start = {x: 0, y: 1}; //@
    const finish = { x: 2, y: 1 }; // X

    const unit = new Unit(start, [start]);
    const game = new Game(board, unit);

    const path = aStar({
      start,
      isEnd (node) {
        return node.x === finish.x && node.y === finish.y;
      },
      neighbor (node) {
        console.log("node", node);
        const icfpc_directions = [ 'E', 'W', 'SW', 'SE' ];
        const hex_coords = Hex.offset_to_cube(node);
        const temp_unit = unit.moveTo(node);
        const allowed_dirs = [0,3,4,5].filter(d => {
          const next_unit = temp_unit.move(icfpc_directions[d]);
          console.log(unit, next_unit);
          return game.isValidPosition(board, next_unit);
        });
        const hex_neighbors = allowed_dirs.map(
            d => Hex.hex_neighbor(hex_coords, d));
        return hex_neighbors.map(Hex.offset_from_cube);
      },
      distance (a, b) {
        return 1;
      },
      heuristic (node) {
        return Hex.hex_distance(Hex.offset_to_cube(finish), Hex.offset_to_cube(node));
      },
      hash (node) {
        return `${node.x}|${node.y}`;
      },
      timeout: 20000
    });
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
