const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect;

const { Board, Unit, Game, Hex } = require('../src/model');

describe('Unit Movement', () => {
  it('should move east and west', () => { // TODO Storm
    expect({x: 0, y: 0}).to.deep.equal({ y: 0, x: 0 });
    const unit = new Unit({ x: 1, y: 0}, [{ x:  0, y: 0}, {x: 2, y: 0}]);
    const unitEast = unit.move('E');
    expect(unitEast.pivot).to.deep.equal({ x: 2, y: 0 });
    expect(unitEast.members).to.deep.equal([{ x:  1, y: 0}, {x: 3, y: 0}]);
    const unitWest = unitEast.move('W');
    expect(unitWest.pivot).to.deep.equal({ x: 1, y: 0 });
    expect(unitWest.members).to.deep.equal([{ x:  0, y: 0}, {x: 2, y: 0}]);
  });

  it('should move diagonaly from even to odd', () => { // TODO Storm
    const unit = new Unit({ x: 1, y: 0}, [{ x:  0, y: 0}, {x: 2, y: 0}]);
    const unitEast = unit.move('SE');
    expect(unitEast.pivot).to.deep.equal({ x: 1, y: 1 });
    expect(unitEast.members).to.deep.equal([{ x:  0, y: 1}, {x: 2, y: 1}]);
    const unitWest = unitEast.move('SW');
    expect(unitWest.pivot).to.deep.equal({ x: 1, y: 2 });
    expect(unitWest.members).to.deep.equal([{ x:  0, y: 2}, {x: 2, y: 2}]);
  });

  it('should move diagonaly from odd to even', () => { // TODO Storm
    const unit = new Unit({ x: 1, y: 1}, [{ x:  0, y: 1}, {x: 2, y: 1}]);
    const unitEast = unit.move('SE');
    expect(unitEast.pivot).to.deep.equal({ x: 2, y: 2 });
    expect(unitEast.members).to.deep.equal([{ x:  1, y: 2}, {x: 3, y: 2}]);
    const unitWest = unitEast.move('SW');
    expect(unitWest.pivot).to.deep.equal({ x: 1, y: 3 });
    expect(unitWest.members).to.deep.equal([{ x:  0, y: 3}, {x: 2, y: 3}]);
  });
});

describe('Single cell rotation', () => {
  it('should rotate ccw', () => {
    const cell = {x: 1, y: 2};
    const ccw1 = Unit.rotate_cell(cell, 'CCW');
    expect(ccw1).to.deep.equal({ x: 2, y: 0 });

    const ccw2 = Unit.rotate_cell(ccw1, 'CCW');
    expect(ccw2).to.deep.equal({ x: 1, y: -2 });

    const ccw3 = Unit.rotate_cell(ccw2, 'CCW');
    expect(ccw3).to.deep.equal({ x: -1, y: -2 });

    const ccw4 = Unit.rotate_cell(ccw3, 'CCW');
    expect(ccw4).to.deep.equal({ x: -2, y: 0 });
  });

  it('should rotate cw', () => {
    const cell = {x: 1, y: 1};
    const ccw1 = Unit.rotate_cell(cell, 'CW');
    expect(ccw1).to.deep.equal({ x: 0, y: 2 });

    const ccw2 = Unit.rotate_cell(ccw1, 'CW');
    expect(ccw2).to.deep.equal({ x: -2, y: 1 });

    const ccw3 = Unit.rotate_cell(ccw2, 'CW');
    expect(ccw3).to.deep.equal({ x: -2, y: -1 });

    const ccw4 = Unit.rotate_cell(ccw3, 'CW');
    expect(ccw4).to.deep.equal({ x: 0, y: -2 });
  });
});

describe('Unit Roatation', () => {
  it('should rotate clockwise', () => {
    const unit = new Unit({ x: 1, y: 1 }, [{ x: 0, y: 1}, { x: 2, y: 1 }]);
    var rotated = unit.rotate('CW');

    expect(rotated.members).to.deep.equal([{ x: 1, y: 0}, { x: 2, y: 2 }]);
  });
  it('should rotate counter-clockwise', () => {
    const unit = new Unit({ x: 1, y: 1 }, [{ x: 0, y: 1 }, { x: 2, y: 1 }]);
    var rotated = unit.rotate('CCW');
    // TODO
    expect(rotated.members).to.deep.equal([{ x: 1, y: 2}, { x: 2, y: 0 }]);
  });
});
