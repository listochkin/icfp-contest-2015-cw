const aStar = require('a-star');
const Hex = require('./hex');
const { Game } = require('./model');

function path (board, unit, start, finish) {
  const game = new Game(board, unit);

  return [aStar({
      start: {
        point: start
      },

      isEnd (node) {
        return node.point.x === finish.x && node.point.y === finish.y;
      },

      neighbor (node) {
        const icfpc_directions = [ 'E', 'NE', 'NW', 'W', 'SW', 'SE' ];
        const hex_coords = Hex.offset_to_cube(node.point);
        const temp_unit = unit.moveTo(node.point);
        const allowed_dirs = [0,3,4,5].filter(d => {
          const next_unit = temp_unit.move(icfpc_directions[d]);
          const isValid = game.isValidPosition(board, next_unit);
          // console.log(icfpc_directions[d], next_unit, isValid);
          return isValid;
        });
        const neighbors = allowed_dirs.map(d => ({
          point: Hex.offset_from_cube(Hex.hex_neighbor(hex_coords, d)),
          direction: icfpc_directions[d]
        }));
        return neighbors
      },

      distance (a, b) {
        return 1;
      },

      heuristic (node) {
        return Hex.hex_distance(Hex.offset_to_cube(finish), Hex.offset_to_cube(node));
      },

      hash (node) {
        return `${node.point.x}|${node.point.y}`;
      },

      timeout: 20000
  })].map(function (result) {
    if (result.status === 'success') {
      const path = result.path.map(a => a.point);
      const commands = result.path.filter(a => a.direction).map(a => a.direction);
      result.path = path;
      result.commands = commands;
    }
    return result;
  })[0];
}

module.exports = path;
