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
    var pivot = this.pivot;
    var new_members = this.members.map(
        p => Unit.rotate_cell(
          { x: p.x - pivot.x, y: p.y - pivot.y },
          direction));
    new_members = new_members.map(p => ({ x: p.x + pivot.x, y: p.y + pivot.y }));
    return new Unit(pivot, new_members);
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

    return {x: (max_x - min_x + 1), y: (max_y - min_y + 1)};
  }

  moveToPoint (leftTopPoint) {
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
  // http://gamedev.stackexchange.com/a/55493/9309
  // http://www.redblobgames.com/grids/hexagons/#rotation
  // odd-r offset to cube
  var x = (c.x - (c.y - (c.y&1)) / 2) | 0;
  var z = c.y;
  var y = -x-z;

  if (direction == 'CW') {
    [x, y, z] = [-z, -x, -y];
  } else if (direction == 'CCW') {
    [x, y, z] = [-y, -z, -x];
  } else {
    throw new Error('Bad rotation direction');
  }

  // cube to odd-r
  var col = x + ((z - (z&1)) / 2) | 0;
  var row = z | 0;

  return {x: col, y: row}
}

module.exports = Unit;
