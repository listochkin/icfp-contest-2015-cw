const Hex = require('../hex');

class Unit {
  constructor (pivot, members) {
    this.pivot = pivot;
    this.members = members;
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
    var unit_size = {x: 0, y: 0};
    for (var i = 0; i < this.members.length; i++) {
      if (this.members[i].x >= unit_size.x)
        unit_size.x = this.members[i].x + 1;
      if (this.members[i].y >= unit_size.y)
        unit_size.y = this.members[i].y + 1;
    }
    return unit_size;
  }

  moveTo (leftTopPoint) {
    var movedUnit = {pivot: {x: (this.pivot.x + leftTopPoint.x), y: (this.pivot.y + leftTopPoint.y)}, members: []};
    movedUnit.pivot.x = this.pivot.x + leftTopPoint.x;
    movedUnit.pivot.y = this.pivot.y + leftTopPoint.y;
    for (var i = 0; i < this.members.length; i++) {
      var movedMember = {x: (this.members[i].x + leftTopPoint.x), y: (this.members[i].y + leftTopPoint.y)};
      movedUnit.members.push(movedMember);
    }
    return movedUnit;
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
