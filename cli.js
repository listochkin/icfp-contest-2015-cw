
const { Board, Unit, Game } = require('./src/model');

const board = new Board(5, 7);
board.fill(2, 3);

board.display();


console.log("\nSuccess"); 
