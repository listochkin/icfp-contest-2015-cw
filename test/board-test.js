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

});
