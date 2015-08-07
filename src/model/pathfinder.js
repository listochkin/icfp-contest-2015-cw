var PriorityQueue = require('../priorityqueue');
var Hex = require('../hex');

// FIXME: just downloaded PQ from Github. It's on npm, maybe you'd like to import it the right way.
//PriorityQueue = priortyqueue.PriorityQueue;

function tuple_comparator(a, b) {
  return a[0] - b[0];
}

//const { Board, Unit, Game } = require('../model');
const Game = require('./game');


// var hex_directions = [Hex(1, 0, -1), Hex(1, -1, 0), Hex(0, -1, 1), Hex(-1, 0, 1), Hex(-1, 1, 0), Hex(0, 1, -1)];
const icfpc_directions = [ 'E', 'NE', 'NW', 'W', 'SW', 'SE' ];

class Graph {
  constructor(board, unit) {
    this.board = board;
    this.unit = unit;
    this.game = new Game();
  }

  neighbors(offset) {
    var hex_coords = Hex.offset_to_cube(offset);
    var allowed_dirs = [0,1,2,3,4,5].filter(d => {
      var next_unit = this.unit.move(icfpc_directions[d]);
      return this.game.isValidPosition(this.board, next_unit);
    });
    var hex_neighbors = allowed_dirs.map(
        d => Hex.hex_neighbor(hex_coords, d));
    return hex_neighbors.map(Hex.offset_from_cube);
  }

  cost(current, next) {
    return 1;
  }
}

class AStar {
  constructor(board, unit, start, finish) {
    this.board = board;
    this.unit = unit;
    this.start = start;
    this.finish = finish;
  }

  heuristic(goal, next) {
    // TODO: use hex distance
    return Hex.hex_distance(
      Hex.offset_to_cube(goal),
      Hex.offset_to_cube(next));
  }

  calc() {
    var frontier = PriorityQueue(tuple_comparator);
    frontier.enq([0, this.start]);
    var came_from = {};
    var cost_so_far = {};
    came_from[this.start] = None;
    cost_so_far[this.start] = 0;

    while (!frontier.isEmpty()) {
      var current = frontier.get()[1];

      if (current == this.finish) {
        break;
      }

      graph = Graph(this.board, this.unit);

      var next;
      for (next of graph.neighbors(current)) {
        next = next[1];
        var new_cost = cost_so_far[current] + graph.cost(current, next);
        if (!(next in cost_so_far) || (new_cost < cost_so_far[next])) {
          cost_so_far[next] = new_cost;
          var priority = new_cost + this.heuristic(this.finish, next);
          frontier.enq([priority, next]);
          came_from[next] = current;
        }
      }
    }

    return came_from;
  }
}

exports.AStar = AStar;
exports.Graph = Graph; // purely for testing
