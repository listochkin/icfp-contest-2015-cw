const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect;

const { Board, Unit, Game } = require('../src/model');

describe('Game Functions', () => {
  describe('is valid position', () => {

    it('no collisions', () => {
      const game = new Game;
      const board = new Board(3, 2);
      const unit = new Unit();
      unit.pivot = {x: 1, y: 1};
      unit.members = [{x: 0, y: 0}, {x: 1, y: 0}];

      expect(game.isValidPosition(board, unit)).to.equal(true);
    });

    it('should not overlap filled cells', () => {
      const game = new Game;
      const board = new Board(3, 2);
      board.fill(1, 1);
      const unit = new Unit();

      unit.pivot = {x: 1, y: 1};
      unit.members = [{x: 0, y: 0}, {x: 1, y: 0}];
      expect(game.isValidPosition(board, unit)).to.equal(false);
    });

    it('should not leave the board', () => {
      const game = new Game;
      const board = new Board(3, 2);

      const unit = new Unit();

      unit.pivot = {x: 1, y: 1};
      unit.members = [{x: 0, y: 0}, {x: 2, y: 0}];
      expect(game.isValidPosition(board, unit)).to.equal(false);
    })
  });

  describe('lock unit on a board', () => {
    it('should lock a unit', () => {
      const game = new Game;
      const board = new Board(5, 6);
      const unit = new Unit({ x: 1, y: 0}, [{ x:  0, y: 0}, {x: 2, y: 0}, {x: 3, y: 3}]);

      const newBoard = game.lock(board, unit);
      expect(newBoard.get(0, 0)).to.equal(1);
      expect(newBoard.get(2, 0)).to.equal(1);
      expect(newBoard.get(3, 3)).to.equal(1);
    });
  });

  describe('spawn a new unit on a board', () => {
    it('should spawn a unit on a same-parity board', () => {
      assert.fail();
    });

    it('should spawn a unit on a board of opposite parity', () => {
      assert.fail();
    })
  })
});
