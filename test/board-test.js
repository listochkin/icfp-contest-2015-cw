const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect;

const { Board, Unit, Game } = require('../src/model');

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

  it('finding lines in boards', () => {
    const board = new Board(3, 7);
    board.fill(0, 3);
    board.fill(1, 3);
    board.fill(2, 3);

    expect(board.getLines()).to.deep.equal([3]);
  });

  it('shoudl clear all lines', () => {
    const board = new Board(3, 7);
    board.fill(0, 3);
    board.fill(1, 3);
    board.fill(2, 3);

    board.fill(0, 2);
    board.fill(1, 2);
    board.fill(2, 2);

    board.fill(0, 1);

    board.clearLines();

    // element should move
    expect(board.get(0, 1)).to.equal(0);
    expect(board.get(0, 3)).to.equal(1);

    // lines should be clear
    expect(board.get(1, 3)).to.equal(0);
    expect(board.get(1, 2)).to.equal(0);

  });

});

describe('Board aggregateHeight', () => {
  it('empty board', () => {
    var board = new Board(5, 7);
    expect(board.aggregateHeight()).to.equal(0);
  });

  it('should returm sum of heights for each column', () => {
    var board = new Board(5, 7);
    board.fill(0, 6);
    board.fill(1, 6);
    board.fill(1, 5);
    expect(board.aggregateHeight()).to.equal(3);
  });
});

describe('Board completeLines', () => {
  it('no lines on empty board', () => {
    var board = new Board(3, 7);
    board.fill(0, 4);
    board.fill(1, 4);
    expect(board.completeLines()).to.equal(0);
  });

  it('should return number of completeLines', () => {
    var board = new Board(3, 7);
    [0, 1, 2].forEach(x => board.fill(x, 4));
    [0, 1, 2].forEach(x => board.fill(x, 6));
    expect(board.completeLines()).to.equal(2);
  });
});

describe('Board holes', () => {
  it('no holes on empty board', () => {
    var board = new Board(3, 7);
    board.fill(0, 4);
    board.fill(1, 4);
    expect(board.completeLines()).to.equal(0);
  });

  it('should return number of holes', () => {
    var board = new Board(3, 7);
    [0, 1, 2].forEach(x => board.fill(x, 4));
    [0, 1, 2].forEach(x => board.fill(x, 5));
    [0, 1, 2].forEach(x => board.fill(x, 6));
    expect(board.holes()).to.equal(0);

    board.clear(0, 4);
    expect(board.holes()).to.equal(0);

    board.clear(1, 5);
    expect(board.holes()).to.equal(1);

    board.clear(1, 6);
    expect(board.holes()).to.equal(1);

    board.clear(2, 6);
    expect(board.holes()).to.equal(2);

  });

});

describe('Board bumpiness', () => {
  it('small bumps', () => {
    var board = new Board(3, 7);
    board.fill(0, 6);
    board.fill(1, 6);
    expect(board.bumpiness()).to.equal(1);
  });

  it('heavy bumps', () => {
    var board = new Board(3, 7);
    board.fill(0, 6);
    board.fill(1, 4);
    expect(board.bumpiness()).to.equal(5);
  });
});


describe('Flood fill', () => {
  it('should fill initial spawn', () => {
    var board = new Board(3, 3);
    board.floodFill();
    expect(board.getFloodFill(1, 0)).to.equal(1);
  });

  it('should fill initial row', () => {
    var board = new Board(3, 3);
    board.floodFill();
    expect(board.getFloodFill(0, 0)).to.equal(1);
  });

  it('should fill other rows', () => {
    var board = new Board(3, 3);
    board.floodFill();
    expect(board.getFloodFill(0, 2)).to.equal(1);
    expect(board.getFloodFill(1, 2)).to.equal(1);
    expect(board.getFloodFill(2, 2)).to.equal(1);
  });

  it('should not fill behind wall', () => {
    var board = new Board(3, 3);
    board.fill(0, 1);
    board.fill(1, 1);
    board.fill(2, 1);

    board.floodFill();
    expect(board.getFloodFill(0, 2)).to.equal(0);
    expect(board.getFloodFill(1, 2)).to.equal(0);
    expect(board.getFloodFill(2, 2)).to.equal(0);
    expect(board.getFloodFill(0, 1)).to.equal(0);
  });
});



