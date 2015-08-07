const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect;
 
const { Board, Unit, Game } = require('../src/model');

describe('Model Tests', () => {
  const asyncTest = f => done => f().then(done).catch(done);

    describe('generator', () => {
    it('should generate pseudo random numbers', () => {
      const board = new Board(5, 7);
      var gen = board.getRandomGenerator(17);
      var exp = [ 0   ,24107,16552,12125,9427 ,13152,21440,3383 ,6873,16117];
      var act = [gen(),gen(),gen(),gen(),gen(),gen(),gen(),gen(),gen(),gen()];
      expect(act).to.deep.equal(exp);
    });
  });
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

  describe('Unit Movement', () => {
    it('should move east and west', () => { // TODO Storm
      expect({x: 0, y: 0}).to.deep.equal({ y: 0, x: 0 });
      const unit = new Unit({ x: 1, y: 0}, [{ x:  0, y: 0}, {x: 2, y: 0}]);
      const unitEast = unit.move('E');
      expect(unitEast.pivot).to.deep.equal({ x: 2, y: 0 });
      expect(unitEast.cells).to.deep.equal([{ x:  1, y: 0}, {x: 3, y: 0}]);
      const unitWest = unitEast.move('W');
      expect(unitWest.pivot).to.deep.equal({ x: 1, y: 0 });
      expect(unitWest.cells).to.deep.equal([{ x:  0, y: 0}, {x: 2, y: 0}]);
    });

    it('should move diagonaly from even to odd', () => { // TODO Storm
      const unit = new Unit({ x: 1, y: 0}, [{ x:  0, y: 0}, {x: 2, y: 0}]);
      const unitEast = unit.move('SE');
      expect(unitEast.pivot).to.deep.equal({ x: 1, y: 1 });
      expect(unitEast.cells).to.deep.equal([{ x:  0, y: 1}, {x: 2, y: 1}]);
      const unitWest = unitEast.move('SW');
      expect(unitWest.pivot).to.deep.equal({ x: 1, y: 2 });
      expect(unitWest.cells).to.deep.equal([{ x:  0, y: 2}, {x: 2, y: 2}]);
    });

    it('should move diagonaly from odd to even', () => { // TODO Storm
      const unit = new Unit({ x: 1, y: 1}, [{ x:  0, y: 1}, {x: 2, y: 1}]);
      const unitEast = unit.move('SE');
      expect(unitEast.pivot).to.deep.equal({ x: 2, y: 2 });
      expect(unitEast.cells).to.deep.equal([{ x:  1, y: 2}, {x: 3, y: 2}]);
      const unitWest = unitEast.move('SW');
      expect(unitWest.pivot).to.deep.equal({ x: 1, y: 3 });
      expect(unitWest.cells).to.deep.equal([{ x:  0, y: 3}, {x: 2, y: 3}]);
    });
  });

  describe('Unit Roatation', () => {
    it('should rotate clockwise', () => {
      const unit = new Unit({ x: 1, y: 1}, [{ x:  0, y: 1}, {x: 2, y: 1}]);
      unit.rotate('E');
      // TODO
      assert.fail();
    });
    it('should rotate counter-clockwise', () => {
      const unit = new Unit({ x: 1, y: 1}, [{ x:  0, y: 1}, {x: 2, y: 1}]);
      unit.rotate('W');
      // TODO
      assert.fail();
    });
  });

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
  });

});
