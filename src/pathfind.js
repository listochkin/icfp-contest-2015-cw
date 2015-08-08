const aStar = require('a-star');
const Hex = require('./hex');
const { Game } = require('./model');

function path (board, unit, start, finish, shouldClose) {
  const icfpc_directions = [ 'E', 'NE', 'NW', 'W', 'SW', 'SE', 'CW', 'CCW' ];

  return [aStar({
      start: {
        unit: unit.moveTo(start)
      },

      isEnd (node) {
        return node.unit.pivot.x === finish.x && node.unit.pivot.y === finish.y;
      },

      neighbor (node) {
        const temp_unit = node.unit;
        // console.log(temp_unit);
        // Yes, rotation increases the branching, but it has a low priority and
        // doesn't improve the heuristic.
        const allowed_dirs = [0,3,4,5,6,7].filter(d => {
          const next_unit = temp_unit.move(icfpc_directions[d]);
          const isValid = board.isValidPosition(next_unit);
          // console.log(icfpc_directions[d], next_unit, isValid);
          return isValid;
        });
        // console.log(allowed_dirs);
        const neighbors = allowed_dirs.map(d => ({
          unit: node.unit.move(icfpc_directions[d]),
          direction: icfpc_directions[d]
        }));
        // console.log(neighbors);
        return neighbors
      },

      distance (a, b) {
        return 1;
      },

      heuristic (node) {
        return Hex.hex_distance(Hex.offset_to_cube(finish), Hex.offset_to_cube(node.unit.pivot));
      },

      hash (node) {
        //var h = `${node.direction}|${node.unit.pivot.x}|${node.unit.pivot.y}`;
        var h = `${node.unit.pivot.x}|${node.unit.pivot.y}`;
        node.unit.members.forEach((m) => {
         h += `|${m.x};${m.y}`;
        });
        return h;
      },

      timeout: 20000
  })].map(function (result) {
    if (result.status === 'success') {
      // backtrack
      var dots = result.path.map(a => a.unit.pivot);
      const commands = [];
      for (var i = 0; i < dots.length - 1; i++) {
        const prev = dots[i];
        const next = dots[i + 1];
        const deltaX = next.x - prev.x;
        const deltaY = next.y - prev.y;
        console.log(prev, next, deltaX, deltaY);
        if (deltaX === 0 && deltaY === 0) {
          throw new Error('unimplemented');
        }

        let eastWest = '';
        if (prev.y % 2 === 0) {
          if (deltaX == 0) {
            eastWest = 'E';
          } else {
            eastWest = 'W';
          }
        } else {
          if (deltaX == 0) {
            eastWest = 'W';
          } else {
            eastWest = 'E'
          }
        }
        let south = deltaY > 0 ? 'S' : '';

        console.log(deltaX, deltaY, south + eastWest)
        commands.push(south + eastWest);
      };
      console.log('commands', commands);

      if (shouldClose) {
        const lastStep = result.path[result.path.length - 1];
        const illegalMoves = [0,3,4,5,6,7].filter(d => {
          const next_unit = lastStep.unit.move(icfpc_directions[d]);
          const isValid = board.isValidPosition(next_unit);
          return !isValid;
        });
        if (illegalMoves.length === 0) {
          throw new Error("can't close the path");
        }
        const direction = icfpc_directions[illegalMoves[0]];
        result.path.push({
          unit: lastStep.unit.move(direction),
          direction: direction
        });
        commands.push(direction);
      }

      const path = result.path.map(a => a.unit.pivot);
      // const commands = result.path.filter(a => a.direction).map(a => a.direction);
      result.path = path;
      result.commands = commands;
    }
    return result;
  })[0];
}

module.exports = path;
