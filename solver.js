var model = require('./src/model'),
  Board = model.Board,
  Unit = model.Unit,
  Game = model.Game,
  TargetPlacementGenerator = model.TargetPlacementGenerator;

var read = require('./src/reader');
var pathfind = require('./src/pathfind');



// ------

function solver (problems, lookupDepth, shouldLog) {

// ++++++++++++
var answer = [];
var seedScores = [];

problems.forEach(function(task, i, arr) {
  var game = read(task);
  var initialBoardCells = JSON.parse(JSON.stringify(game.board.cells));
  //console.log(task.units.length);

  var encoding = {
          W : "p",
          E : "b",
          SW : "a",
          SE : "m",
          CW : "d",
          CCW : "k"
        };

  task.sourceSeeds.forEach(function(seed, i, arr) {
      var solution = "";
      game.board.cells = JSON.parse(JSON.stringify(initialBoardCells));
      game.clearScore();
      var rand = game.board.getRandomGenerator(seed);

      for(var unitIndex = 0; unitIndex < task.sourceLength; unitIndex++) {
        var currentUnit = rand()%task.units.length;
        //console.log(currentUnit);

        var unit = new Unit(task.units[currentUnit].pivot, task.units[currentUnit].members);
        game.unit = game.spawn(game.board, unit);

        if(shouldLog) {
          game.display();
          console.log(" ");
        }

        // check for endgame
        if(!game.isValidPosition(game.board, game.unit))
          break;

        var failed = false;
        // Find best reachable position and path there
        var targetGenerator = new TargetPlacementGenerator(game.board, game.unit, lookupDepth);
        if(targetGenerator.created == false) {
          failed = true;
          break;
        }
        var unitDest = targetGenerator.next();
        if(!unitDest) {
          solution += 'a';
          break;
        }
        var generatorFailed = false;
        while(!generatorFailed) {
          // using pathfinder

           if(shouldLog) {
             var tmp = game.unit;
             game.unit = unitDest;
             game.display();
             console.log("placement found");
             game.unit = tmp;
           }

          var path = pathfind(game.board, game.unit, game.unit.pivot, unitDest.pivot);
          // if(shouldLog) {
          //   console.log(path.commands);
          // }
          if(path.status == 'success')
            break;

          unitDest = targetGenerator.next();
          if(!unitDest) {
            solution += 'a';
            generatorFailed = true;
          }
        }

        // safe-trace returned path and generate answer sequence
        if(path == null || path.commands == null) {
          failed = true;
          break;
        }
        for(var i=0; i < path.commands.length; i++) {
          var dir = path.commands[i];

          //if(shouldLog) {
          //  console.log(" i=" + i + " of "+path.commands.length);
          //  console.log(dir);
          //}
          solution += encoding[dir];
          var moved = game.unit.move(dir);
          if(game.isValidPosition(game.board, moved)) {
            game.unit = moved;

            // if(shouldLog) {
            //   game.display();
            //   console.log("valid move ");
            // }
          }
          else {
            failed = true;
             if(shouldLog) {
               game.display();
               console.log("invalid move ");
             }
            break;
          }
        }

        // finish path to locking
        if(!failed) {
          while(1) {
            var dir = "E";
            var moved = game.unit.move(dir);
            solution += encoding[dir];
            if(game.isValidPosition(game.board, moved)) {
              game.unit = moved;
            }
            else
              break;
          }
        }

        if(shouldLog) {
           game.display();
           console.log(solution);
         }
         //solution += ' ';

        // apply unit and find score
        game.board.fillByUnit(game.unit);
        game.moveScoreCount(game);
        if(shouldLog) {
          console.log('Score so far: ', game.moveScoreGet());
        }
        game.board.clearLines();
        game.unit = undefined;

        if(shouldLog) {
          //game.display();
          //console.log(" ");
          console.log("unit completed");
        }
      }

    var t9 = require('./src/t9');
    var t9solution = t9(solution);

    //solution = solution.substring(0, solution.length-1);
    var entry = {
      problemId : task.id,
      seed : seed,
      tag : 'cw_v14_pathfind' + task.id,
      solution : t9solution
    };
    answer.push(entry);

    seedScores.push(game.moveScoreGet().move_scores);

  });
});

return {
  answers: answer,
  seedScores: seedScores
}

// ++++++++++++
}

module.exports = solver;
