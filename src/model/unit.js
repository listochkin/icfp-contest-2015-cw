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
