const aStar = require('a-star');
const Hex = require('./hex');
const { Game } = require('./model');

function path (board, unit, start, finish) {
  const game = new Game(board, unit);

  return aStar({
      start,
      isEnd (node) {
        return node.x === finish.x && node.y === finish.y;
      },
      neighbor (node) {
        const icfpc_directions = [ 'E', 'NE', 'NW', 'W', 'SW', 'SE' ];
        const hex_coords = Hex.offset_to_cube(node);
        const temp_unit = unit.moveTo(node);
        console.log('temp: ', temp_unit);
        const allowed_dirs = [0,3,4,5].filter(d => {
          const next_unit = temp_unit.move(icfpc_directions[d]);
          const isValid = game.isValidPosition(board, next_unit);
          console.log(icfpc_directions[d], next_unit, isValid);
          return isValid;
        });
        const hex_neighbors = allowed_dirs.map(
            d => Hex.hex_neighbor(hex_coords, d));
        return hex_neighbors.map(Hex.offset_from_cube);
      },
      distance (a, b) {
        return 1;
      },
      heuristic (node) {
        return Hex.hex_distance(Hex.offset_to_cube(finish), Hex.offset_to_cube(node));
      },
      hash (node) {
        return `${node.x}|${node.y}`;
      },
      timeout: 20000
    })
}

module.exports = path;
