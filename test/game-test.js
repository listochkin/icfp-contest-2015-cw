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
    it('should lock several unit', () => {
      const game = new Game;
      const boardA = new Board(5, 6);
      const boardB = new Board(5, 6);
      const unit1 = new Unit({ x: 1, y: 0}, [{ x:  0, y: 0}]);
      const unit2 = new Unit({ x: 1, y: 0}, [                {x: 2, y: 0}, {x: 3, y: 3}]);
      const unit3 = new Unit({ x: 1, y: 0}, [{ x:  0, y: 0}, {x: 2, y: 0}, {x: 3, y: 3}]);

      const newBoardA = game.lock(game.lock(boardA, unit1), unit2);
      const newBoardB = game.lock(boardB, unit3);
      expect(newBoardA).to.deep.equal(newBoardB);
    });
  });

  describe('spawn a new unit on a board', () => {
    it('should spawn a unit on a same-parity board', () => {
      const game = new Game;
      const board = new Board(8, 6);
      const unit = new Unit({ x: 1, y: 0}, [{ x:  0, y: 0}, {x: 2, y: 0}, {x:3, y: 3}]);

      const spawned = game.spawn(board, unit);

      expect(spawned).to.deep.equal(new Unit({x: 3, y:0}, [{ x:  2, y: 0}, {x: 4, y: 0}, {x: 5, y: 3}]));
    });

    it('should spawn a unit off board east', () => {
      const game = new Game;
      const board = new Board(8, 6);
      const unit = new Unit({ x: 11, y: 0}, [{ x:  10, y: 0}, {x: 12, y: 0}, {x:13, y: 3}]);

      const spawned = game.spawn(board, unit);

      expect(spawned).to.deep.equal(new Unit({x: 3, y:0}, [{ x:  2, y: 0}, {x: 4, y: 0}, {x: 5, y: 3}]));
    });

    it('should spawn a unit off board west', () => {
      const game = new Game;
      const board = new Board(8, 6);
      const unit = new Unit({ x: -9, y: 0}, [{ x:  -10, y: 0}, {x: -8, y: 0}, {x:-7, y: 3}]);

      const spawned = game.spawn(board, unit);

      expect(spawned).to.deep.equal(new Unit({x: 3, y:0}, [{ x:  2, y: 0}, {x: 4, y: 0}, {x: 5, y: 3}]));
    });

    it('should spawn a unit off board north', () => {
      const game = new Game;
      const board = new Board(8, 6);
      const unit = new Unit({ x: 11, y: -2}, [{ x:  10, y: -2}, {x: 12, y: -2}, {x:13, y: 1}]);

      const spawned = game.spawn(board, unit);

      expect(spawned).to.deep.equal(new Unit({x: 3, y:0}, [{ x:  2, y: 0}, {x: 4, y: 0}, {x: 5, y: 3}]));
    });

    it('should spawn a unit off board south', () => {
      const game = new Game;
      const board = new Board(8, 6);
      const unit = new Unit({ x: -9, y: 10}, [{ x:  -10, y: 10}, {x: -8, y: 10}, {x:-7, y: 13}]);

      const spawned = game.spawn(board, unit);

      expect(spawned).to.deep.equal(new Unit({x: 3, y:0}, [{ x:  2, y: 0}, {x: 4, y: 0}, {x: 5, y: 3}]));
    });

    it('should spawn a unit on a board of opposite parity', () => {
      const game = new Game;
      const board = new Board(8, 4);
      const unit = new Unit({ x: 1, y: 0}, [{ x:  0, y: 0}]);

      const spawned = game.spawn(board, unit);

      expect(spawned).to.deep.equal(new Unit({x: 4, y:0}, [{ x:  3, y: 0}]));
    })
  })
});
