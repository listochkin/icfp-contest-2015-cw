const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect;

const { Board, Unit, Game } = require('../src/model');

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
