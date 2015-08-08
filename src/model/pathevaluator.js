class pathevaluator {

  constructor(board) {
    this.board = board;
    this.cells = [];

    // it's possible situation when pivot is out of board, but all members are in, and this position is considered valid.
    // So we need some additional overlay(margin for it). Todo: we might make it not constant, but calculate it base on unit configuration
    this.margin = 10;



    for (var i = 0; i< board.height + this.margin * 2; i++) {
      this.cells.push([]);
      for (var j = 0; j < board.width + this.margin * 2; j++) {
        this.cells[i][j] = [];
        for(var rot = 0; rot < 6; rot++) { // 6 possible rotations in hexagon
          this.cells[i][j][rot] = 0;
        }
      };
    }

  }

  evaluationStep(unit, cameInDirection, fullString) {
    var newUnit = unit.move(cameInDirection);

    console.log('from: ' + unit.pivot.y + ' ' + unit.pivot.x + ' to: ' + newUnit.pivot.y + ' ' + newUnit.pivot.x + ' by ' + cameInDirection);



    if(!this.board.isValidPosition(newUnit)) {
      return;
    };
    if(this.cells[newUnit.pivot.y + this.margin][newUnit.pivot.x + this.margin][0] != 0) { // were already here, do not evaluate this part of tree
      return;
    }
    this.cells[newUnit.pivot.y + this.margin][newUnit.pivot.x + this.margin][0] = fullString;
    //['W', 'E', 'SW', 'SE'].forEach(function(item, i, arr) { this.evaluationStep(newUnit, item); });
//    console.log('setting ' + newUnit.pivot.y + ' ' + newUnit.pivot.x + ' to ' + fullString);

    this.evaluationStep(newUnit, 'a', fullString + 'a');
    this.evaluationStep(newUnit, 'l', fullString + 'l');
    this.evaluationStep(newUnit, 'p', fullString + 'p');
    this.evaluationStep(newUnit, 'b', fullString + 'b');

  }

  proceedEvaluation(startingUnit) {
//    console.log('starting: ' + startingUnit.pivot.y + ' ' + startingUnit.pivot.x);
    this.cells[startingUnit.pivot.y + this.margin][startingUnit.pivot.x + this.margin][0] = "ORIG";
    // next, try to move to all possible directions and if they are not already occupied, go there
    this.evaluationStep(startingUnit, 'a', 'a');
    this.evaluationStep(startingUnit, 'l', 'l');
    this.evaluationStep(startingUnit, 'p', 'p');
    this.evaluationStep(startingUnit, 'b', 'b');
  }

  checkReachable(unit) {
    var path = this.cells[unit.pivot.y + this.margin][unit.pivot.x + this.margin][0];
    if(path != 0) {
//      console.log('checked for: ' + unit.pivot.y + ' ' + unit.pivot.x + '; result = ' + path );
      return true;
    }
    return false;
  }
}


module.exports = pathevaluator;
