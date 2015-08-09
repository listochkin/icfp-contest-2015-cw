const { Board, Unit, Game } = require('../src/model');


function parse_map_array(map_array) {
  //map_array = [
  // ". @ .",
  //  ". # .",
  // ". X ."
  //];

  var board = new Board((map_array[0].length+1) / 2, map_array.length);
  var start = null;
  var finish = null;
  var pivot = null;
  var members = [];

  for (var y=0; y<board.height; y++) {
    for (var x=0; x<board.width; x++) {

      const cell = map_array[y].charAt(x * 2);
      if (cell == '.') {
        // noop
      } else if (cell == '#') {
        board.fill(x, y);
      } else if (cell == '@') {
        start = { x: x, y: y };
        pivot = start;
        members.push(start);
      } else if (cell == '+') {
        start = { x: x, y: y };
        pivot = start;
      } else if (cell == '*') {
        members.push({ x: x, y: y });
      } else if (cell == 'X') {
        finish = { x: x, y: y };
      } else {
        throw Error('Bad map at ' + x + ',' + y);
      }
    }
  }

  var unit = null;
  if (pivot && members) {
    unit = new Unit(pivot, members);
  }
  //return {
  //  board: board,
  //  start: start,
  //  finish: finish
  //  unit: unit;
  //}
  return [board, start, finish, unit]
}

module.exports = parse_map_array;
