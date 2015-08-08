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
        console.log("node", node);
        const icfpc_directions = [ 'E', 'W', 'SW', 'SE' ];
        const hex_coords = Hex.offset_to_cube(node);
        const temp_unit = unit.moveTo(node);
        const allowed_dirs = [0,3,4,5].filter(d => {
          const next_unit = temp_unit.move(icfpc_directions[d]);
          console.log(unit, next_unit);
          return game.isValidPosition(board, next_unit);
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
