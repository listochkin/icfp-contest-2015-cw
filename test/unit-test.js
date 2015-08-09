const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect;

const { Board, Unit, Game, Hex } = require('../src/model');

describe('Unit Movement', () => {
  it('should move east and west', () => {
    expect({x: 0, y: 0}).to.deep.equal({ y: 0, x: 0 });
    const unit = new Unit({ x: 1, y: 0}, [{ x:  0, y: 0}, {x: 2, y: 0}]);
    const unitEast = unit.move('E');
    expect(unitEast.pivot).to.deep.equal({ x: 2, y: 0 });
    expect(unitEast.members).to.deep.equal([{ x:  1, y: 0}, {x: 3, y: 0}]);
    const unitWest = unitEast.move('W');
    expect(unitWest.pivot).to.deep.equal({ x: 1, y: 0 });
    expect(unitWest.members).to.deep.equal([{ x:  0, y: 0}, {x: 2, y: 0}]);
  });

  it('should move diagonaly from even to odd', () => {
    const unit = new Unit({ x: 1, y: 0}, [{ x:  0, y: 0}, {x: 2, y: 0}]);
    const unitEast = unit.move('SE');
    expect(unitEast.pivot).to.deep.equal({ x: 1, y: 1 });
    expect(unitEast.members).to.deep.equal([{ x:  0, y: 1}, {x: 2, y: 1}]);
    const unitWest = unitEast.move('SW');
    expect(unitWest.pivot).to.deep.equal({ x: 1, y: 2 });
    expect(unitWest.members).to.deep.equal([{ x:  0, y: 2}, {x: 2, y: 2}]);
  });

  it('should move diagonaly from odd to even', () => {
    const unit = new Unit({ x: 1, y: 1}, [{ x:  0, y: 1}, {x: 2, y: 1}]);
    const unitEast = unit.move('SE');
    expect(unitEast.pivot).to.deep.equal({ x: 2, y: 2 });
    expect(unitEast.members).to.deep.equal([{ x:  1, y: 2}, {x: 3, y: 2}]);
    const unitWest = unitEast.move('SW');
    expect(unitWest.pivot).to.deep.equal({ x: 1, y: 3 });
    expect(unitWest.members).to.deep.equal([{ x:  0, y: 3}, {x: 2, y: 3}]);
  });
});

describe('Unit Movement without copy', () => {
  it('should move east and west', () => {
    expect({x: 0, y: 0}).to.deep.equal({ y: 0, x: 0 });
    const unit = new Unit({ x: 1, y: 0}, [{ x:  0, y: 0}, {x: 2, y: 0}]);

    unit.moveNc('E');
    expect(unit.pivot).to.deep.equal({ x: 2, y: 0 });
    expect(unit.members).to.deep.equal([{ x:  1, y: 0}, {x: 3, y: 0}]);
    unit.moveNc('W');
    expect(unit.pivot).to.deep.equal({ x: 1, y: 0 });
    expect(unit.members).to.deep.equal([{ x:  0, y: 0}, {x: 2, y: 0}]);
  });

  it('should move diagonaly from even to odd', () => {
    const unit = new Unit({ x: 1, y: 0}, [{ x:  0, y: 0}, {x: 2, y: 0}]);
    unit.moveNc('SE');
    expect(unit.pivot).to.deep.equal({ x: 1, y: 1 });
    expect(unit.members).to.deep.equal([{ x:  0, y: 1}, {x: 2, y: 1}]);
    unit.moveNc('SW');
    expect(unit.pivot).to.deep.equal({ x: 1, y: 2 });
    expect(unit.members).to.deep.equal([{ x:  0, y: 2}, {x: 2, y: 2}]);
  });

  it('should move diagonaly from odd to even', () => {
    const unit = new Unit({ x: 1, y: 1}, [{ x:  0, y: 1}, {x: 2, y: 1}]);
    unit.moveNc('SE');
    expect(unit.pivot).to.deep.equal({ x: 2, y: 2 });
    expect(unit.members).to.deep.equal([{ x:  1, y: 2}, {x: 3, y: 2}]);
    unit.moveNc('SW');
    expect(unit.pivot).to.deep.equal({ x: 1, y: 3 });
    expect(unit.members).to.deep.equal([{ x:  0, y: 3}, {x: 2, y: 3}]);
  });
});

describe('Unit Move By', () => {
  it('move unit by 1 down', () => {
    var unit = new Unit({ x: 0, y: 0}, [{ x: 1, y: 1}]);
    var moved = unit.moveBy({x: 0, y: 0}, {x: 1, y: 1});
    expect(moved.pivot).to.deep.equal({ x: 1, y: 1 });
    expect(moved.members).to.deep.equal([{ x: 3, y: 2}]);

    var moved = unit.moveBy({x: 1, y: 1}, {x: 3, y: 2});
    expect(moved.pivot).to.deep.equal({ x: 1, y: 1 });
    expect(moved.members).to.deep.equal([{ x: 3, y: 2}]);

  });
});

describe('Unit Move To', () => {
  it('move unit by 1 down', () => {
    expect({x: 0, y: 0}).to.deep.equal({ y: 0, x: 0 });
    const unit = new Unit({ x: 0, y: 0}, [{ x: 0, y: 1}]);
    const moved = unit.moveTo({x: 0, y: 3});
    expect(moved.pivot).to.deep.equal({ x: 0, y: 3 });
    expect(moved.members).to.deep.equal([{ x: 1, y: 4}]);
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

describe('Unit Rotation', () => {
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
  it('should keep rotation counter updated', () => {
    const unit = new Unit({ x: 1, y: 1 }, [{ x: 1, y: 1 }]);
    expect(unit.rotation).to.equal(0);

    var rotated = unit.rotate('CW');
    expect(rotated.rotation).to.equal(1);

    rotated = rotated.rotate('CW');
    expect(rotated.rotation).to.equal(2);

    rotated = rotated.rotate('CW');
    expect(rotated.rotation).to.equal(3);

    rotated = rotated.rotate('CW');
    rotated = rotated.rotate('CW');
    expect(rotated.rotation).to.equal(5);

    rotated = rotated.rotate('CW');
    expect(rotated.rotation).to.equal(0);

    rotated = rotated.rotate('CCW');
    expect(rotated.rotation).to.equal(5);

  });

});

// describe.skip('Finding greedy direction', () => {
//   it('should work on odd row', () => {
//     const unit = new Unit({ x: 3, y: 0 }, [{ x: 3, y: 0}]);
//     const targetUnit = new Unit({ x: 3, y: 1 }, [{ x: 3, y: 1}]);
//     const targetUnitFar = new Unit({ x: 10, y: 1 }, [{ x: 10, y: 1}]);

//     expect(unit.getGreedyDirection(targetUnit)).to.equal('SE');
//     expect(unit.getGreedyDirection(targetUnitFar)).to.equal('E');

//     const unit2 = new Unit({ x: 3, y: 0 }, [{ x: 3, y: 0}]);
//     const targetUnit2 = new Unit({ x: 2, y: 1 }, [{ x: 2, y: 1}]);
//     const targetUnitFar2 = new Unit({ x: 0, y: 1 }, [{ x: 0, y: 1}]);
//     expect(unit2.getGreedyDirection(targetUnit2)).to.equal('SW');
//     expect(unit2.getGreedyDirection(targetUnitFar2)).to.equal('W');
//   });

//   it('should work on even row', () => {
//     const unit = new Unit({ x: 3, y: 1 }, [{ x: 3, y: 1}]);
//     const targetUnit = new Unit({ x: 3, y: 2 }, [{ x: 3, y: 2}]);
//     const targetUnitFar = new Unit({ x: 10, y: 2 }, [{ x: 10, y: 2}]);

//     expect(unit.getGreedyDirection(targetUnit)).to.equal('SW');
//     expect(unit.getGreedyDirection(targetUnitFar)).to.equal('E');

//     const unit2 = new Unit({ x: 3, y: 1 }, [{ x: 3, y: 1}]);
//     const targetUnit2 = new Unit({ x: 4, y: 2 }, [{ x: 4, y: 2}]);
//     const targetUnitFar2 = new Unit({ x: 0, y: 2 }, [{ x: 0, y: 2}]);
//     expect(unit2.getGreedyDirection(targetUnit2)).to.equal('SE');
//     expect(unit2.getGreedyDirection(targetUnitFar2)).to.equal('W');
//   });
// });

describe('Finding path to figure', () => {
  it('should count minimum path from pivot to figure 1', () => {
        const unit = new Unit({x: 1, y: 0}, [{x: 0, y: 0}, {x: 2, y: 0}]);
      expect(unit.minPivotDistance()).to.equal(1);
    });

  it('should count minimum path from pivot to figure 2', () => {
    const unit = new Unit({x: -5, y: 1}, [{x: 0, y: 0}, {x: 2, y: 0}]);
    expect(unit.minPivotDistance()).to.equal(5);
  });
});

describe('Unit equality', () => {
  it('should compare units regarding and disregarding the pivot point', () => {
    var u1 = new Unit({ x: 4, y: 2 }, [{ x: 4, y: 2 }, { x: 1, y: 3 }]);
    var u2 = new Unit({ x: 4, y: 2 }, [{ x: 4, y: 2 }, { x: 1, y: 3 }]);
    expect(u1.equals(u2)).to.equal(true);
    expect(u1.equalMembers(u2)).to.equal(true);

    u1 = new Unit({ x: 4, y: 2 }, [{ x: 4, y: 2 }, { x: 2, y: 8 }]);
    expect(u1.equals(u2)).to.equal(false);
    expect(u1.equalMembers(u2)).to.equal(false);

    u1 = new Unit({ x: 0, y: 0 }, [{ x: 1, y: 3 }, { x: 4, y: 2 }]);
    expect(u1.equals(u2)).to.equal(false);
    expect(u1.equalMembers(u2)).to.equal(true);
  });
});
