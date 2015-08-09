const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect;

const Hex = require('../src/hex');
const { Board, Unit, Game } = require('../src/model');
const pathfind = require('../src/pathfind');

const parse_map_array = require('./test-map-parser');


describe('A* test', () => {
  it('should find a path', () => {
    const map_array = [
      ". @ .",
       ". # .",
      ". X ."
    ];

    const [board, unit, finish] = parse_map_array(map_array);
    const path = pathfind(board, unit, finish);

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

    const [board, unit, finish] = parse_map_array(map_array);
    const path = pathfind(board, unit, finish);

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

    const [board, unit, finish] = parse_map_array(map_array);
    const path = pathfind(board, unit, finish);

    expect(path.status).to.equal('noPath');
  });

  it('should find a path when needs to turn to squeeze', () => {
    const map_array = [
      ". @ *",
       "# . #",
      ". X .",
       ". . ."
    ];

    const [board, unit, finish] = parse_map_array(map_array);
    const path = pathfind(board, unit, finish);

    expect(path.status).to.equal('success');
    expect(path.commands).to.deep.equal(['CW', 'SE', 'SW', 'CCW']);
    expect(path.cost).to.equal(4);
  });

  it('should find a path with pivot outside of the glass', () => {
    const map_array = [
      "+ . * .",
       ". # # #",
      ". X . ."
    ];

    const [board, unit, finish] = parse_map_array(map_array);
    const path = pathfind(board, unit, finish);

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

    const [board, unit, finish] = parse_map_array(map_array);
    const path = pathfind(board, unit, finish);

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

    const [board, unit, finish] = parse_map_array(map_array);
    const path = pathfind(board, unit, finish);

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

    const [board, unit, finish] = parse_map_array(map_array);
    const path = pathfind(board, unit, finish);

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
    const [board, unit, finish] = parse_map_array(map_array);
    const path = pathfind(board, unit, finish);

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
    const [board, unit, finish] = parse_map_array(map_array);
    const path = pathfind(board, unit, finish, 'close');

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

    const [board, unit, pre_finish] = parse_map_array(map_array);
    const finish = pre_finish.move('CCW');
    const path = pathfind(board, unit, finish);

    expect(path.status).to.equal('success');
    expect(path.commands).to.deep.equal([ 'W', 'W', 'SW', 'SW', 'CCW', 'SW' ]);
  });

  it('should rotate and find a path', () => {
    const map_array = [
      ". * + *",
       ". . . .",
      "# . # #",
       ". . . .",
      ". X . .",
       ". . . ."
    ];

    const [board, unit, finish] = parse_map_array(map_array);
    const path = pathfind(board, unit, finish);

    //console.log(path.commands);

    expect(path.status).to.equal('success');
    expect(path.commands).to.deep.equal(['SW', 'CCW', 'SW', 'SW', 'SE', 'CW']);
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

    const [board, unit, finish] = parse_map_array(map_array);
    const path = pathfind(board, unit, finish, 'close');

    // console.log(path.commands);

    expect(path.status).to.equal('success');
  });

  it('should walk around the wall (problem 24)', () => {
    const map_array = [
'. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . + . . . . . . . * . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
 '. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
'. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
 '. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
'. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
 '. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
'. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
 '. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
'. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
 '. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
'. . . . . . . . . . . . . . # . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
 '. . . . . . . . . . . . . # . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
'. . . . . . . . . . . . . . # . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
 '. . . . . . . . . . . . . # . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
'. . . . . . . . . . . . . . # . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
 '. . . . . . . . . . . . . # . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
'. . . . . . . . . . . . . . # . . . . . . . . . . . . . . . . . . . . . . . . . . . . . # # # . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
 '. . . . . . . . . . . . # # # # . . . . . . . . . . . . . . . . . . . . . . . . . . # # . . # # . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
'. . . . . . . . . . . # # . . . # # . . . . . . . . . . . . . . . . . . . . . . . # # . . . . . # # # . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
 '. . . . . . . . . . # . . . . . . # . . . . . . . . . . . . . . . . . . . . . . . # . . . . . . . # . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
'. . . . . . . . . . . # # . . . # # . . . . . . . . . . . . . . . . . . . . . . . # . . . . . . . # . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
 '. . . . . . . . . . . . # . . # . . . . . . . . . . . . . . . . . . . . . . . . . # . . . . . . . # . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
'. . . . . . . . . . . . . # . # . . . . . . . . . . . . . . . . . . . . . . . . . # . . . . . . . # . . . . . . . . . . . . . . . . . . . . . . . . . . . # # # # # # . . . . . . . . . . . . . . . # #',
 '. . . . . . . . . # # # # . . # # # . . . . . . . . . . . . # # # # # # . . . . . # . . . . . . . # . . . . . . . . . . . . . . . . . . . . . . . . . . # . . . . . # . . . . . . . . . . . . . . . # .',
'. . . . . . . . . . # . . . . . . # . . . . . . . . . . . . . # . . . # . . . . . # . . . . . . . # . . . . . . . . . . . . . . . . . . . . . . . # # # . # . . . . # . . . . . . . . . . . . . . . # .',
 '. . . . . . . . . # . . . . . . . # . . . . . . . . . . . . # . . . . # . . . . . # . . . . . . . # . # # # . . . . . . . . . . . . . . . # . . # . . # # . . . . . # . . . . . . . . . . . . . . . # .',
'. . . . . . . . . . # . . . . . . # . . . . . . . . . . . . . # . . . # . . . . . # . . . . . . . . # # . . # # # . . . . . . . . . . . . # # . # . . . . . . . . . # # . . . . . . . . . . . . . . # .',
 '# # # # . . . . . # . . . . . . . # . . . . . . . . . . . . # . . . . # . . . . . # . . . . . . . . . . . . . # . . . . . . . . . . . # # . # # . . . . . . . . . . . # . . . . . # # # . . . . . . # .',
'. . . . # . . . . . # . . . . . . # # # # . . . . . . . . . . # . . . # . . . . . # . . . . . . . . . . . . . . # # . . . . . . . . . . # . . . . . . . . . . . . . . # . . . # # # . . # # # # . . # .',
 '. . . # . . . . . # . . . . . . . . . . # . . . . . . . . . # . . . . # . . . . . # . . . . . . . . . . . . . . # . . . . . . . . . . # . . . . . . . . . . . . . . . # # # # . . . . . . . . # # . # .',
'. . . . # . . . . . # . . . . . . . . . # . . . . . . . . . . # . . . # . . . . . # . . . . . . . . . . . . . . . # . . . . . . . . . . # . . . . . . . . . . . . . . . . . . . . . . . . . . . . # # .',
 '. . . # . . . . . # . . . . . . . . . . # . . . . . . . . . # . . . . # . . . . . # . . . . . . . . . . . . . . # . . . . . . . . # # # . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
'. . . . # . . . . . # . . . . . . . . . # . . . # # # . . . . # . . . . # # . . . # . . . . . . . . . . . . . . . # . . . . . # # # . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
 '. . . . # . . # # # . . . . . . . . . . # . # # # # # # . . # . . . . . . # # # . # . . . . . . . . . . . . . . # . . . . . . # . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
'. . . . # . . # . . . . . . . . . . . . # . # . . . . . # . . # . . . . . . . # . # . . . . . . . . . . . . . . . # . . . . . # . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
 '. . . . # . # . . . . . . . . . . . . . # . # . . . . . # # # . . . . . . . . # # . . . . . . . . . . . . . . . # . # # # # # . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
'. . . . . # # # . . . . . . . . . . . . # . # . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . # . # . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
 '. . . . . . . . . . . . . . . . . . . . # . # . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . # # . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
'. . . . . . . . . . . . . . . . . . . . # . # . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . X . . . . . . . . . . . . . . . . . . . . . . .'
];

    const [board, unit, finish] = parse_map_array(map_array);

    const path = pathfind(board, unit, finish);

    // console.log(path.commands);

    expect(path.status).to.equal('success');
  });

  it('should solve problem 22', () => {
    var map_array = [
        ". . . . @ * . . . .",
         ". . . . . . . . . .",
        "X # # # # # # # # #",
         ". . . . . . . . # #"
      ];

    const [board, unit, pre_finish] = parse_map_array(map_array);
    const finish = pre_finish.move('CCW');
    const path = pathfind(board, unit, finish);

    expect(path.status).to.equal('success');
    expect(path.commands).to.deep.equal(['SW', 'W', 'CCW', 'W', 'W', 'SW']);
  });

  it('should solve problem 22 vol2', () => {
    var map_array = [
        ". . . . @ * . . . .",
         ". . . . . . . . . .",
        "# # # # # # # # # X",
         ". . . . . . . . # #"
      ];

    const [board, unit, pre_finish] = parse_map_array(map_array);
    const finish = pre_finish.move('CCW');
    const path = pathfind(board, unit, finish);

    expect(path.status).to.equal('success');
    expect(path.commands).to.deep.equal([ 'E', 'E', 'E', 'SE', 'E', 'CCW', 'SE' ]);
  });

});
