const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect;

const { Board, Unit, Game } = require('../src/model');

describe('Game Functions', () => {
  describe('is valid position', () => {
    // TODO

    it('should not overlap filled cells', () => {
      const game = new Game;
      const board = new Board(5, 6);
      const unit = new Unit();

      game.isValidPosition(board, unit);
      assert.fail();
    });

    it('should not leave the board', () => {

    })
  });

  describe('lock unit on a board', () => {
    it('should lock a unit', () => {
      const game = new Game;
      const board = new Board(5, 6);
      const unit = new Unit();

      const newBoard = game.lock(board, unit);

      assert.fail();
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
