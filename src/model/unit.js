const Hex = require('../hex');

function _coords_partial_cmp(a, b) {
  const ydiff = a.y-b.y;
  if (ydiff != 0) {
    return ydiff;
  }
  return a.x - b.x;
}

class Unit {
  constructor (pivot, members, id = -1, rotation = 0) {
    // NOTE: Why cloning? Do these ever get modified?
    this.pivot = JSON.parse(JSON.stringify(pivot));
    this.members = JSON.parse(JSON.stringify(members));
    this.rotation = rotation;
    this.hashValue = null;
    this.id = id;
  }

  hash () {
    if (!this.hashValue) {
      var h = `${this.pivot.x}|${this.pivot.y}`;
      this.members.forEach((m) => {
        h += `|${m.x};${m.y}`;
      });
      this.hashValue = h;
    }
    return this.hashValue;
  }

  equals(other) {
    if ((this.pivot.x != other.pivot.x) || (this.pivot.y != other.pivot.y)) {
      return false
    }
    return this.equalMembers(other)
  }

  equalMembers(other) {
    if (this.members.length != other.members.length) {
      return false
    }
    const m = this.members.slice(0).sort(_coords_partial_cmp);
    const o = other.members.slice(0).sort(_coords_partial_cmp);
    for (var i=0; i<m.length; i++) {
      if ((m[i].x != o[i].x) || (m[i].y != o[i].y)) {
        return false
      }
    }
    return true;
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

    return new Unit(pivot, members, this.id, this.rotation);
  }

  moveNc (direction) {
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
    this.pivot.x += this.pivot.y%2 ? deltaXOdd : deltaXEven;
    this.pivot.y += deltaY;

    this.members.forEach(function(item, i, arr) {
      item.x += (item.y%2) ? deltaXOdd : deltaXEven;
      item.y += deltaY;
    });
  }

  rotate (direction) {
    var rotation = this.rotation + (direction == 'CW' ? 1 : -1);

    if (rotation >=6)
      rotation -= 6;

    if (rotation < 0)
      rotation += 6;

    var hex_pivot = Hex.offset_to_cube(this.pivot);
    var hex_members = this.members.map(p => Hex.offset_to_cube(p));

    // move hex coordinates so pivot is a center of coordinates
    var centered_members = hex_members.map(p => Hex.hex_subtract(p, hex_pivot));

    var rotated = centered_members.map(p => Unit.rotate_hex_cell(p, direction));

    var move_back = rotated.map(p => Hex.hex_add(p, hex_pivot));

    var new_members = move_back.map(p => Hex.offset_from_cube(p));

    return new Unit(this.pivot, new_members, this.id, rotation);
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

  moveBy (from, to) { // FIXME: there are issues when moving between odd and even lines. It's recommended to move by y first, then recompute what is needed for x and move by separate moveBy
    var hexOffset = Hex.hex_subtract(Hex.offset_to_cube(to), Hex.offset_to_cube(from));
    var newPivot = Hex.offset_from_cube(Hex.hex_add(hexOffset, Hex.offset_to_cube(this.pivot)));
    var newMembers = this.members.map(m => Hex.offset_from_cube(Hex.hex_add(hexOffset, Hex.offset_to_cube(m))));
    return new Unit(newPivot, newMembers, this.id, this.rotation);
  }

  moveTo (newPivot) {
    var hexOffset = Hex.hex_subtract(Hex.offset_to_cube(newPivot), Hex.offset_to_cube(this.pivot));
    var newMembers = this.members.map(m => Hex.offset_from_cube(Hex.hex_add(hexOffset, Hex.offset_to_cube(m))));
    return new Unit(newPivot, newMembers, this.id, this.rotation);
  }

  minPivotDistance () {
    var cube_pivot = Hex.offset_to_cube(this.pivot);
    var distance = 0;
    for(var i=0; i < this.members.length; i++) {
      var cube_point = Hex.offset_to_cube(this.members[i]);
      var d = Hex.hex_distance(cube_pivot, cube_point);
      if(i == 0)
        distance = d;
      else if(d < distance)
        distance = d;
    }

    return distance;

  }

  oneDirectionFromPivot () {
    var weights = {N: 0, S:0, E:0, W:0};
    for(var i=0; i < this.members.length; i++) {
      if(this.members[i].x > this.pivot.x)
        weights.E++;
      else if(this.members[i].x < this.pivot.x)
        weights.W++;
      else {
        weights.E++;
        weights.W++;
      }

      if(this.members[i].y > this.pivot.y)
        weights.S++;
      else if(this.members[i].y < this.pivot.y)
        weights.N++;
      else {
        weights.S++;
        weights.N++;
      }

    }
    if((weights.N && !weights.S) || (!weights.N && weights.S))
      return true;
    if((weights.E && !weights.W) || (!weights.E && weights.W))
      return true;
    return false;
  }

  toString() {
    return JSON.stringify(this);
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
