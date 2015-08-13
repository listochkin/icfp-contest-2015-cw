const aStar = require('a-star');
const Hex = require('./hex');
const { Game } = require('./model');

function path (board, start_unit, finish_unit, shouldClose) {
  const icfpc_directions = [ 'E', 'NE', 'NW', 'W', 'SW', 'SE', 'CW', 'CCW' ];

  return [aStar({
      start: {
        unit: start_unit
      },

      isEnd (node) {
        return node.unit.equals(finish_unit);
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
        // TODO: hex_distance may be optimized with a dumb, more specialized
        // replacement: hex_offset_distance(EVEN/ODD, {x1, y1}, {x2, y2})
        return Hex.hex_distance(
          // NOTE: unit.members[0] will add no overhead at all, but is less precise.
          Hex.offset_to_cube(finish_unit.getSize().min),
          Hex.offset_to_cube(node.unit.getSize().min));
      },

      hash (node) {
        return node.unit.hash();
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
        const deltaR = next.rotation - prev.rotation;
        // console.log(prev, next, deltaX, deltaY);

        let action;

        // rotation
        if (deltaX === 0 && deltaY === 0) {
          // console.log(result.path[i].unit);
          // console.log(result.path[i+1].unit);
          if (deltaR === 1) {
            action = 'CW';
          } else if (deltaR === -1) {
            action = 'CCW';
          } else {
            // no rotation data saved, need to recreate
            action = ([6,7].map(d => {
              return {
                unit: result.path[i].unit.move(icfpc_directions[d]),
                direction: icfpc_directions[d]
              }
            }).filter(({ unit, direction }) => {
              return unit.hash() === result.path[i + 1].unit.hash();
            }).map(a => a.direction))[0];
          }

          commands.push(action);
          continue;
        }

        if (deltaX === -1 && deltaY === 0) {
          action = 'W';
        } else if (deltaX === 1 && deltaY === 0) {
          action = 'E';
        } else if (prev.y % 2 === 0) {
          // even row
          if (deltaX === -1) {
            action = 'SW';
          } else if (deltaX === 0) {
            action = 'SE';
          }

        } else {
          // odd row
          if (deltaX === 0 ) {
            action = 'SW';
          } else if (deltaX === 1) {
            action = 'SE';
          }
        }

        commands.push(action);
        continue;
      };
      // console.log('commands', commands);

      if (shouldClose) {
        const lastStep = result.path[result.path.length - 1];
        const illegalMoves = [0,3,4,5,6,7].filter(d => {
          const next_unit = lastStep.unit.move(icfpc_directions[d]);
          const isValid = board.isValidPosition(next_unit);
          return !isValid;
        });
        if (illegalMoves.length === 0) {
          Object.assign(new Game(), { board, unit: lastStep.unit }).display();

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
