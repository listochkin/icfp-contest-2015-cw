const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect;

const Hex = require('../src/hex');

const { Board, Unit, Game } = require('../src/model');
const pathfind = require('../src/pathfind');

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


describe('A* test', () => {
  it('should find a path', () => {
    const map_array = [
      ". @ .",
       ". # .",
      ". X ."
    ];

    const [board, start, finish, unit] = parse_map_array(map_array);
    const path = pathfind(board, unit, start, finish);

    //console.log(path.commands);
    expect(path.status).to.equal('success');
    expect(path.commands).to.deep.equal(['SW', 'SE']);
    expect(path.cost).to.equal(2);
  });

  it('should find another path', () => {
    const map_array = [
      ". @ .",
       ". . .",
      ". X ."
    ];

    const [board, start, finish, unit] = parse_map_array(map_array);
    const path = pathfind(board, unit, start, finish);

    //console.log(path.commands);
    expect(path.status).to.equal('success');
    expect(path.commands).to.deep.equal(['SE', 'SW']);
    expect(path.cost).to.equal(2);
  });

  it('should fail with no path', () => {
    const map_array = [
      ". @ .",
       "# # #",
      ". X ."
    ];

    const [board, start, finish, unit] = parse_map_array(map_array);
    const path = pathfind(board, unit, start, finish);

    expect(path.status).to.equal('noPath');
  });

  it('should find a path when needs to turn to squeeze', () => {
    const map_array = [
      ". @ *",
       "# . #",
      ". X .",
       ". . ."
    ];

    const [board, start, finish, unit] = parse_map_array(map_array);
    const path = pathfind(board, unit, start, finish);

    expect(path.status).to.equal('success');
    expect(path.commands).to.deep.equal(['CW', 'SE', 'SW']);
    expect(path.cost).to.equal(3);
  });

  it('should find a path with pivot outside of the glass', () => {
    const map_array = [
      "+ . * .",
       ". # # #",
      ". X . ."
    ];

    const [board, start, finish, unit] = parse_map_array(map_array);
    const path = pathfind(board, unit, start, finish);

    expect(path.status).to.equal('success');
    expect(path.commands).to.deep.equal(['W', 'SW', 'SE', 'E', 'E']);
    expect(path.cost).to.equal(5);
  });

  it('should find a path rotating different ways', () => {
    const map_array = [
      "* + * .",
       ". . . .",
      "# # . #",
       "# # . #",
      ". . . .",
       ". . . .",
      ". . . .",
       ". # . #",
      ". # . #",
       ". X . #"
    ];

    const [board, start, finish, unit] = parse_map_array(map_array);
    const path = pathfind(board, unit, start, finish);

    expect(path.status).to.equal('success');
    expect(path.commands).to.deep.equal(['SE', 'CW', 'SE', 'SE', 'SE', 'SW', 'SW', 'SW', 'SW', 'CCW', 'SE']);
    expect(path.cost).to.equal(11);
  });


  it('should find a path on a harder map', () => {
    const map_array = [
      ". @ . . . . .",
       ". . . . . . .",
      ". . . . . . .",
       "# # # # # . .",
      ". . . . . # .",
       ". . . X . . .",
      ". . . . . . .",
       ". . . . . . ."
    ];

    const [board, start, finish, unit] = parse_map_array(map_array);
    const path = pathfind(board, unit, start, finish);

    //console.log(path.commands);
    expect(path.status).to.equal('success');
    expect(path.cost).to.equal(10);
  });

  it('should have some rollercoaster', () => {
    const map_array = [
      ". @ . . . . .",
       ". # # # # # #",
      ". . . . . . .",
       "# # # # # # .",
      ". # . # . . .",
       ". . . . # . .",
      ". # # # # # .",
       ". . . . X # #"
    ];

    const [board, start, finish] = parse_map_array(map_array);
    const unit = new Unit(start, [start]);
    const path = pathfind(board, unit, start, finish);

    //console.log(path.commands);
    expect(path.status).to.equal('success');
    expect(path.cost).to.equal(21);
  });

  it('should return correct path for empty map (regression: problem_0)', () => {
    const map_array = [
      ". . . . @ . . . . .",
       ". . . . . . . . . .",
      ". . . . . . . . . .",
       ". . . . . . . . . .",
      ". . . . . . . . . .",
       ". . . . . . . . . .",
      ". . . . . . . . . .",
       ". . . . . . . . . .",
      ". . . . . . . . . .",
       ". . . . . . . . . X"
    ];
    const [board, start, finish] = parse_map_array(map_array);
    const unit = new Unit(start, [start]);
    const path = pathfind(board, unit, start, finish);

    for (var i = 0; i < 10; i++) {
      var line = i % 2 ? ' ' : '';
      for (var j = 0; j < 10; j++) {
        let pp = path.path.filter(p => {
          return p.x == j && p.y == i;
        });
        const isOnPath = pp.length > 0;
        line = line + ' ' + (isOnPath ? '*' : '.');
      };
      // console.log(line);
    };
    // console.log(path.commands);
    expect(path.commands.indexOf('E')).to.equal(path.commands.lastIndexOf('E'));
    expect(path.commands).to.deep.equal([ 'SE', 'SE', 'SE', 'SE', 'SE', 'SE', 'SE', 'SE', 'SE', 'E' ]);
  });

  it('should close path', () => {
    const map_array = [
      ". @ . . . . .",
       ". . . . . . .",
      ". . . . . . .",
       "# X . . . . .",
      "# # . . . . .",
       "# # . . . . .",
      "# # # . . . .",
       "# # # . . . ."
    ];
    const [board, start, finish, unit] = parse_map_array(map_array);
    const path = pathfind(board, unit, start, finish, 'close');

    expect(path.commands).to.deep.equal([ 'SE', 'SE', 'SW', 'W' ]);
    expect(path.status).to.equal('success');
  });

  it('should solve problem 23', () => {
    var map_array = [
        ". . . * @ * . . . .",
         ". . . . . . . . . .",
        ". . . . . . . . . .",
         "X # # # # # # # # .",
        ". . . . . . . . . .",
         ". # # # # # # # # .",
        ". . . . . . . . . .",
         ". # # # # # # # # .",
        ". . . . . . . . . . "
      ];

    const [board, start, finish, unit] = parse_map_array(map_array);
    const path = pathfind(board, unit, start, finish, 'close');

    expect(path.status).to.equal('success');
    expect(path.commands).to.deep.equal([ 'W', 'W', 'SW', 'CCW', 'SW', 'SW' ]);
  });

  it('should rotate and find a path', () => {
    const map_array = [
       ". * + *",
      ". . . .",
       "X # # #",
      ". . . ."
    ];

    const [board, start, finish, unit] = parse_map_array(map_array);
    const path = pathfind(board, unit, start, finish);

    //console.log(path.commands);

    expect(path.status).to.equal('success');
    expect(path.commands).to.deep.equal(['SW', 'W', 'CCW', 'SW']);
  });

  it('should prefer filling the gaps (regression problem_17)', () => {
    const map_array = [
      '. . . . . . . @ . . . . . . .',
       '. . . . . . . . . . . . . . .',
      '. . . . . . . . . . . . . . .',
       '. . . . . . . . . . . . . . .',
      '. . . . . . . . . . . . . . .',
       '. . . . . . . . . . . . . . .',
      '. . . . . . . . . . . . . . .',
       '. . . . . . . . . . . . . . .',
      '. . . . . . . . . . . . . . .',
       '# # # # # # # # # # # # # X #',
      '# . # # # # # # # # # # # # #',
       '# # # # # # . # # # # # # # #',
      '# # # . # # # # # # # # # # #',
       '# # # # # # # # # # # # . # #',
      '# # # # # # # # # # # # # # .'
    ];

    const [board, start, finish, unit] = parse_map_array(map_array);
    const path = pathfind(board, unit, start, finish, 'close');

    // console.log(path.commands);

    expect(path.status).to.equal('success');
  });
});
