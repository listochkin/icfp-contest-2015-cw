const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect;

const model = require('../src/model'),
  Board = model.Board;

describe('Model Tests', () => {
  const asyncTest = f => done => f().then(done).catch(done);

  describe('Board', () => {
    it('should mark cell', () => {
      const board = new Board(5, 7);
      expect(board.get(2, 3)).to.equal(0);
      board.fill(2, 3);
      expect(board.get(2, 3)).to.equal(1);
      board.clear(2, 3);
      expect(board.get(2, 3)).to.equal(0);
    });

    it('shoud clear a row', () => {
      const board = new Board(5, 7);
      board.fill(2, 3);
      board.fill(3, 4);
      board.fill(4, 5);
      board.clearLine(4);
      expect(board.get(2, 3)).to.equal(0);
      expect(board.get(2, 4)).to.equal(1);
      expect(board.get(4, 5)).to.equal(1);
      expect(board.get(3, 4)).to.equal(0);
    });
  });

});
