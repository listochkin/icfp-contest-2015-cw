var model = require('./src/model'),
  Board = model.Board,
  Unit = model.Unit,
  Game = model.Game,
  TargetPlacementGenerator = model.TargetPlacementGenerator;

var pathfind = require('./src/pathfind');
var read = require('./src/reader');
var GA = require('./src/GA')


var fs = require('fs')


var initialA = -0.51;// not used now
var initialB = 2.00;
var initialC = -0.35;

var ga = new GA();

[
  "problems/problem_0.json"
].forEach(function(fileName, i, arr) {
  var data = fs.readFileSync(fileName);
  var task = JSON.parse(data);
  var game = read(task);
  var initialBoardCells = JSON.parse(JSON.stringify(game.board.cells));
  console.log("file: " + fileName);
  //console.log(task.units.length);

  while(1) {
    task.sourceSeeds.forEach(function(seed, i, arr)
    {
      game.clearScore();
      var euristicParameters = ga.getItem();

      console.log("attempt #next");
      console.log("a/b/c/queueSize" + euristicParameters.a + "/" + euristicParameters.b + "/" + euristicParameters.c + "/" + euristicParameters.queueSize);


      console.log("seed: " + seed);
      game.board.cells = JSON.parse(JSON.stringify(initialBoardCells));
      var rand = game.board.getRandomGenerator(seed);

      for(var unitIndex = 0; unitIndex < task.sourceLength; unitIndex++) {

        var currentUnit = rand()%task.units.length;
        //console.log(currentUnit);
        var unit = new Unit(task.units[currentUnit].pivot, task.units[currentUnit].members);
        game.unit = game.spawn(game.board, unit);

        // check for endgame
        if(!game.isValidPosition(game.board, game.unit)) {
          break;
        }
        // Find best reachable position and path there
        game.board.setHeuristicParameters(euristicParameters.a, euristicParameters.b, euristicParameters.c);
        var targetGenerator = new TargetPlacementGenerator(game.board, game.unit, euristicParameters.queueSize);
        var unitDest = targetGenerator.next();
        console.log("nextUnit: " + unitDest.pivot.x + " " + unitDest.pivot.y);
        while(1) {
          // using pathfinder

          var tmp = game.unit;
          game.unit = unitDest;
          game.display();
          game.unit = tmp;
          console.log("------------");
          var path = pathfind(game.board, game.unit, game.unit.pivot, unitDest.pivot);
          if(path.status == 'success')
            break;

          unitDest = targetGenerator.next();
          console.log("nextUnit: " + unitDest.pivot.x + " " + unitDest.pivot.y);
        }

        for(var i=0; i < path.commands.length; i++) {
          var dir = path.commands[i];

          var moved = game.unit.move(dir);
          if(game.isValidPosition(game.board, moved)) {
            game.unit = moved;
          }
        }
        // apply unit and find score
        game.board.fillByUnit(game.unit);
        game.moveScoreCount(game);
        console.log('Score so far: ', game.moveScoreGet());
        game.board.clearLines();
        game.unit = undefined;

      }
      var thisAttemptScore = game.moveScoreGet().move_scores;
      console.log('score for this attempt: ' + thisAttemptScore);
      ga.setItemTargetValue(thisAttemptScore);
    });
  }
});

