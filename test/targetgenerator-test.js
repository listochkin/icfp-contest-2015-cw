const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect;

const { Board, Unit, Game, TargetPlacementGenerator } = require('../src/model');

const parse_map_array = require('./test-map-parser');

describe('find target unit placement', () => {
  it('should move to bottom right 1 member unit', () => {
    const map_array = [
      ". @ . . .",
       ". . . . .",
      ". . . . ."
    ];

    const [board, unit] = parse_map_array(map_array);

    var generator = new TargetPlacementGenerator(board, unit, 1);
    var targetUnit = generator.next();

    expect(targetUnit.members).to.deep.equal([{x: 4, y: 2}]);
  });

    it('should move to bottom right 2 members unit', () => {
      const map_array = [
        ". @ * . .",
         ". . . . .",
        ". . . . ."
      ];

      const [board, unit] = parse_map_array(map_array);

      var generator = new TargetPlacementGenerator(board, unit, 1);
      var targetUnit = generator.next();

      expect(targetUnit.members).to.deep.equal([{x: 3, y: 2}, {x: 4, y: 2}]);
    });

    it('should skip occupied cells', () => {
      const board = new Board(8, 5);
      board.fill(7, 4);
      board.fill(6, 4);

      const unit = new Unit({x: 1, y: 1}, [{x: 3, y: 2}]);

      var generator = new TargetPlacementGenerator(board, unit, 1);
      var targetUnit = generator.next();

      expect(targetUnit.pivot).to.deep.equal({x: 3, y: 3});
      expect(targetUnit.members).to.deep.equal([{x: 5, y: 4}]);
    });

    it('should skip occupied rows', () => {
      const map_array = [
        ". . . . . . . .",
         ". + . . . . . .",
        ". . . * . . . .",
         ". . . . . . . .",
        "# # # # # # # #"
      ];

      const [board, unit] = parse_map_array(map_array);

      var generator = new TargetPlacementGenerator(board, unit, 1);
      var targetUnit = generator.next();

      expect(targetUnit.pivot).to.deep.equal({x: 5, y: 2});
      expect(targetUnit.members).to.deep.equal([{x: 6, y: 3}]);
    });

    it('complete line first', () => {
      const board = new Board(3, 5);
      [0, 1].forEach(x => board.fill(x, 2));

      const unit = new Unit({x: 1, y: 0}, [{x: 1, y: 0}]);

      var generator = new TargetPlacementGenerator(board, unit, 10);
      var targetUnit = generator.next();

      expect(targetUnit.pivot).to.deep.equal({x: 2, y: 2});
      expect(targetUnit.members).to.deep.equal([{x: 2, y: 2}]);
    });

    it('fill hole first', () => {
      const board = new Board(3, 5);
      board.fill(0, 3);

      const unit = new Unit({x: 1, y: 0}, [{x: 1, y: 0}]);

      var generator = new TargetPlacementGenerator(board, unit, 10);
      var targetUnit = generator.next();

      expect(targetUnit.pivot).to.deep.equal({x: 0, y: 4});
      expect(targetUnit.members).to.deep.equal([{x: 0, y: 4}]);
    });

    it('rotate unit', () => {
      const map_array = [
        ". @ * . . . .",
         ". . . . . . .",
        ". . . . . . .",
         "# # # # # . #",
        ". . . . . # ."
      ];

      const [board, unit] = parse_map_array(map_array);

      var generator = new TargetPlacementGenerator(board, unit, 20, true);
      var targetUnit = generator.next();

      expect(targetUnit.members).to.deep.equal([{x: 5, y: 3}, {x: 6 ,y: 4}]);

    });

    it('rotate unit 2', () => {
      const map_array = [
        ". @ * . . . .",
         ". . . . . . .",
        ". . . . . . .",
         "# . # # # . #",
        ". . . . . # ."
      ];

      const [board, unit] = parse_map_array(map_array);

      var generator = new TargetPlacementGenerator(board, unit, 20, true);
      var targetUnit = generator.next();

      expect(targetUnit.members).to.deep.equal([{x: 3, y: 4}, {x: 4 ,y: 4}]);

    });

  });
