const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect;

const { Board, Unit, Game, TargetPlacementGenerator } = require('../src/model');


  describe('find target unit placement', () => {
    it('should move to bottom right corner', () => {
      const game = new Game();
      const board = new Board(8, 5);
      const unit = new Unit({x: 1, y: 1}, [{x: 3, y: 2}]);

      var generator = new TargetPlacementGenerator(board, unit, 1);
      var targetUnit = generator.next();

      expect(targetUnit.pivot).to.deep.equal({x: 5, y: 3});
      expect(targetUnit.members).to.deep.equal([{x: 7, y: 4}]);
    });

    it('should skip occupied cells', () => {
      const game = new Game();
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
      const game = new Game();
      const board = new Board(8, 5);
      [0, 1, 2, 3, 4, 5, 6, 7].forEach(x => board.fill(x, 4));

      const unit = new Unit({x: 1, y: 1}, [{x: 3, y: 2}]);

      var generator = new TargetPlacementGenerator(board, unit, 1);
      var targetUnit = generator.next();

      expect(targetUnit.pivot).to.deep.equal({x: 5, y: 2});
      expect(targetUnit.members).to.deep.equal([{x: 6, y: 3}]);
    });

    it('complete line first', () => {
      const game = new Game();
      const board = new Board(3, 5);
      [0, 1].forEach(x => board.fill(x, 2));

      const unit = new Unit({x: 1, y: 0}, [{x: 1, y: 0}]);

      var generator = new TargetPlacementGenerator(board, unit, 10);
      var targetUnit = generator.next();

      expect(targetUnit.pivot).to.deep.equal({x: 2, y: 2});
      expect(targetUnit.members).to.deep.equal([{x: 2, y: 2}]);
    });

    it('fill hole first', () => {
      const game = new Game();
      const board = new Board(3, 5);
      board.fill(0, 3);

      const unit = new Unit({x: 1, y: 0}, [{x: 1, y: 0}]);

      var generator = new TargetPlacementGenerator(board, unit, 10);
      var targetUnit = generator.next();

      expect(targetUnit.pivot).to.deep.equal({x: 0, y: 4});
      expect(targetUnit.members).to.deep.equal([{x: 0, y: 4}]);
    });

  });
