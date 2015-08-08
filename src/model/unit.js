const Hex = require('../hex');

class Unit {
  constructor (pivot, members) {
    this.pivot = JSON.parse(JSON.stringify(pivot));
    this.members = JSON.parse(JSON.stringify(members));
  }

  move (direction) {

    var deltaXOdd = 0, deltaXEven = 0, deltaY = 0;
    switch(direction) {
        case 'SW':
          deltaXOdd = 0;
          deltaXEven = -1;
          deltaY = 1;
          break;
        case 'SE':
          deltaXOdd = 1;
          deltaXEven = 0;
          deltaY = 1;
          break;
        case 'W':
          deltaXOdd = -1;
          deltaXEven = -1;
          break;
        case 'E':
          deltaXOdd = 1;
          deltaXEven = 1;
          break;
        case 'CW':
        case 'CCW':
          return this.rotate(direction);
          break;

    }
    var pivot = { x: this.pivot.x + (this.pivot.y%2 ? deltaXOdd : deltaXEven), y: this.pivot.y + deltaY};
    var members = [];

    this.members.forEach(function(item, i, arr) {
      members.push({ x: item.x + ((item.y%2) ? deltaXOdd : deltaXEven), y: item.y + deltaY} );
    });

    return new Unit(pivot, members);
  }

  rotate (direction) {
    var hex_pivot = Hex.offset_to_cube(this.pivot);
    var hex_members = this.members.map(p => Hex.offset_to_cube(p));

    // move hex coordinates so pivot is a center of coordinates
    var centered_members = hex_members.map(p => Hex.hex_subtract(p, hex_pivot));

    var rotated = centered_members.map(p => Unit.rotate_hex_cell(p, direction));

    var move_back = rotated.map(p => Hex.hex_add(p, hex_pivot));

    var new_members = move_back.map(p => Hex.offset_from_cube(p));

    return new Unit(this.pivot, new_members);
  }

  getMembers () {
    return this.members;
  }

  getSize () {
    var min_x = this.members[0].x;
    var min_y = this.members[0].y;
    var max_x = this.members[0].x;
    var max_y = this.members[0].y;
    for (var i = 1; i < this.members.length; i++) {
      if (this.members[i].x > max_x)
        max_x = this.members[i].x;
      if (this.members[i].y > max_y)
        max_y = this.members[i].y;
      if (this.members[i].x < min_x)
        min_x = this.members[i].x;
      if (this.members[i].y < min_y)
        min_y = this.members[i].y;
    }

    return {x: (max_x - min_x + 1), y: (max_y - min_y + 1), min: {x: min_x, y: min_y}, max: {x: max_x, y: max_y}};
  }

  moveBy (offset) {
    var movedPivot = {x: (this.pivot.x + offset.x), y: (this.pivot.y + offset.y)};
    var movedMembers = this.members.map(m => ({x: m.x + offset.x, y: m.y + offset.y}));

    return new Unit(movedPivot, movedMembers);
  }

  moveTo (newPivot) {
    return this.moveBy({x: newPivot.x - this.pivot.x, y: newPivot.y - this.pivot.y});
  }

  getGreedyDirection(target) {
    var dir = this.pivot.x > target.pivot.x ? "W" : "E";
    //console.log()
    if(Math.abs(this.pivot.x - target.pivot.x) <=1)
      dir = "S" + dir;
    return dir;
  }

}

Unit.rotate_cell = (c, direction) => {
  var hex = Hex.offset_to_cube(c);
  return Hex.offset_from_cube(Unit.rotate_hex_cell(hex, direction));
}

Unit.rotate_hex_cell = (hex, direction) => {

  var x = hex.q;
  var y = hex.s;
  var z = hex.r;

  if (direction == 'CW') {
    [x, y, z] = [-z, -x, -y];
  } else if (direction == 'CCW') {
    [x, y, z] = [-y, -z, -x];
  } else {
    throw new Error('Bad rotation direction');
  }

  return new Hex.Hex(x, z, y);

}

module.exports = Unit;
