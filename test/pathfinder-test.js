const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect;

const { Board, Unit, Game, Pathfinder } = require('../src/model');

describe('Graph', () => {
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

describe('A* pathfinder', () => {
  describe('heuristic', () => {
    it('should return the distance between cells', () => {
      // TODO
      assert.fail();
    });
  });

  describe.only('calc', () => {
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
