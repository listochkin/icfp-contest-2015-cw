const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect;

const { Board, Unit } = require('../src/model');

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

  describe('Unit', () => {
    it('should move east and west', () => { // Todo Storm
      expect({x: 0, y: 0}).to.deep.equal({ y: 0, x: 0 });
      const unit = new Unit({ x: 1, y: 0}, [{ x:  0, y: 0}, {x: 2, y: 0}]);
      const unitEast = unit.move('E');
      expect(unitEast.pivot).to.deep.equal({ x: 2, y: 0 });
      expect(unitEast.cells).to.deep.equal([{ x:  1, y: 0}, {x: 3, y: 0}]);
      const unitWest = unitEast.move('W');
      expect(unitWest.pivot).to.deep.equal({ x: 1, y: 0 });
      expect(unitWest.cells).to.deep.equal([{ x:  0, y: 0}, {x: 2, y: 0}]);
    });

    it('should move doagonaly', () => { // Todo Storm
      const unit = new Unit({ x: 1, y: 0}, [{ x:  0, y: 0}, {x: 2, y: 0}]);
      const unitEast = unit.move('SE');
      expect(unitEast.pivot).to.deep.equal({ x: 2, y: 1 });
      expect(unitEast.cells).to.deep.equal([{ x:  1, y: 1}, {x: 3, y: 1}]);
      const unitWest = unitEast.move('SW');
      expect(unitWest.pivot).to.deep.equal({ x: 1, y: 2 });
      expect(unitWest.cells).to.deep.equal([{ x:  0, y: 2}, {x: 2, y: 2}]);
    });
  })

});
