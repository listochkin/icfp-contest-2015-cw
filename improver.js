var model = require('./src/model'),
  Board = model.Board,
  Unit = model.Unit,
  Game = model.Game,
  TargetPlacementGenerator = model.TargetPlacementGenerator;

var pathfind = require('./src/pathfind');
var read = require('./src/reader');

var fs = require('fs')

var attempts = 3;

[
  "problems/problem_0.json"
].forEach(function(fileName, i, arr) {
  var data = fs.readFileSync(fileName);
  var task = JSON.parse(data);
  var game = read(task);
  var initialBoardCells = JSON.parse(JSON.stringify(game.board.cells));
  //console.log(task.units.length);

  task.sourceSeeds.forEach(function(seed, i, arr) {
    var solution = "";
    var bestScore = -1;
    var bestSolution = "";
    for(var attempt = 0; attempt < attempts; attempt++){
      solution = "";
      console.log("attempt #" + attempt);
      game.clearScore();
      game.board.cells = JSON.parse(JSON.stringify(initialBoardCells));
      var rand = game.board.getRandomGenerator(seed);

      console.log("length: " + task.sourceLength);
      for(var unitIndex = 0; unitIndex < task.sourceLength; unitIndex++) {
        var currentUnit = rand()%task.units.length;
        //console.log(currentUnit);
        console.log("got unit");
        var unit = new Unit(task.units[currentUnit].pivot, task.units[currentUnit].members);
        game.unit = game.spawn(game.board, unit);

        // check for endgame
        if(!game.isValidPosition(game.board, game.unit)) {
          break;
        }
        console.log("valid");

        // Find best reachable position and path there
        var targetGenerator = new TargetPlacementGenerator(game.board, game.unit, 1);
        var unitDest = targetGenerator.next();
        while(1) {
          // using pathfinder

          var tmp = game.unit;
          game.unit = unitDest;
          game.display();
          console.log("placement found");
          game.unit = tmp;

          var path = pathfind(game.board, game.unit, game.unit.pivot, unitDest.pivot);
          if(path.status == 'success')
            break;

          unitDest = targetGenerator.next();
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

        console.log("unit completed");
      }
      var thisAttemptScore = game.moveScoreGet().move_scores;
      console.log('score for this attempt: ' + thisAttemptScore);
      }

  });
});

