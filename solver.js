module.exports = solve;
var read = require('./src/reader');
var pathfind = require('./src/pathfind');

var model = require('./src/model'),
  Board = model.Board,
  Unit = model.Unit,
  Game = model.Game,
  TargetPlacementGenerator = model.TargetPlacementGenerator;

function solve({
  tasks,
  powerPhrases,
  singleSeedRun,
  lookupDepth,
  lookupThreshold,
  logEnabled,
  perflogEnabled,
  startTime,
  timeLimit
}) {
//+++++++++++++

var answer = [];
var seedScores = [];
var totalScoresSum = 0;

function taskComplexity (task) {
  const fieldLevelFactor = 1;
  const fieldFillFactor = 3;
  const unitsFactor = 1;
  const lengthFactor = 1

  return fieldLevelFactor * (task.height * task.width) +
    fieldFillFactor * task.filled.length +
    unitsFactor * task.units.length * (task.sourceLength * lengthFactor);
}

function compareRuns(r1, r2) {
  return taskComplexity(r1.task) - taskComplexity(r2.task);
}

const firstRun = tasks.map((task, fileIndex) => ({
  task,
  seed: task.sourceSeeds[0],
  seedIndex: 0,
  fileIndex
})).sort(compareRuns);

const otherRuns = tasks.reduce((runs, task, fileIndex) => {
  return runs.concat(task.sourceSeeds.filter((seed, i) => i !== 0).map((seed, i) => ({
    task,
    seed,
    seedIndex: i + 1, // 0th is in firstRun
    fileIndex
  })));
}, []).sort(compareRuns);

const combinedRuns = [...firstRun, ...otherRuns];

let useSimpleStartegy = false;
for (let currentRun of combinedRuns) {
  let task = currentRun.task;
  var seedScoresAvg = 0;

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

      var seed = currentRun.seed;
      var solution = "";
      game.board.cells = JSON.parse(JSON.stringify(initialBoardCells));
      game.clearScore();
      var rand = game.board.getRandomGenerator(seed);

      for(var unitIndex = 0; unitIndex < task.sourceLength; unitIndex++) {
        var currentUnit = rand()%task.units.length;
        //console.log(currentUnit);

        var unit = new Unit(task.units[currentUnit].pivot, task.units[currentUnit].members, currentUnit);
        game.unit = game.spawn(game.board, unit);

        if(logEnabled) {
          game.display();
          console.log(" ");
        }

        // check for endgame
        if(!game.isValidPosition(game.board, game.unit))
          break;

        // Find best reachable position and path there
        var generatorFailed = false;

        if (!useSimpleStartegy) {
          var targetGenerator = new TargetPlacementGenerator(game.board, game.unit, lookupDepth, true, game, lookupThreshold);
          if(targetGenerator.created == false) {
            generatorFailed = true;
          }
          else {
            var unitDest = targetGenerator.next();
            if(!unitDest) {
              if(logEnabled) console.log('targetGenerator.next() returned null');
              //solution += 'a';
              //break;
            }
          }
        } else {
          generatorFailed = true; // trigger basic tracer;
        }

        while(!generatorFailed) {
          // using pathfinder

           if(logEnabled) {
             var tmp = game.unit;
             game.unit = unitDest;
             game.display();
             console.log("placement found");
             //console.log('Unit passing size: ', game.unit.getPassingSize());
             game.unit = tmp;
           }

          var path = pathfind(game.board, game.unit, unitDest);
          // if(logEnabled) {
          //   console.log(path.commands);
          // }
          if(path.status == 'success')
            break;

          unitDest = targetGenerator.next();
          if(!unitDest) {
            if(logEnabled) console.log('targetGenerator.next() returned null #2');
            //solution += 'a';
            generatorFailed = true;
          }
        }

        // safe-trace returned path and generate answer sequence
        let traceFailed = false;
        if(!generatorFailed && path && path.commands ) {
          for(var i=0; i < path.commands.length; i++) {
            var dir = path.commands[i];
            //if(logEnabled) {
            //  console.log(" i=" + i + " of "+path.commands.length);
            //  console.log(dir);
            //}
            solution += encoding[dir];
            var moved = game.unit.move(dir);
            if(game.isValidPosition(game.board, moved)) {
              game.unit = moved;

              // if(logEnabled) {
              //   game.display();
              //   console.log("valid move ");
              // }
            }
            else {
              traceFailed = true;
               if(logEnabled) {
                 game.display();
                 console.log("invalid move ");
               }
              break;
            }
          }
        }

        // finish path to locking
        if(!traceFailed) {
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

        if(logEnabled) {
           game.display();
           console.log();
         }
         //solution += ' ';

        // apply unit and find score
        game.board.fillByUnit(game.unit);
        game.moveScoreCount(game);
        if(perflogEnabled) {

          var scoresSum = 0;
          for( var i = 0; i < seedScores.length; i++ ) scoresSum += seedScores[i];
          seedScoresAvg = seedScores.length ? scoresSum/seedScores.length : 0;

          var executionTime = new Date() - startTime;

          console.log('File: ' + (currentRun.fileIndex + 1) + "/" + tasks.length
            + ' Task id: ' + task.id
            + ' Time: ' + (executionTime / 1000)
            + ' Seed: ' + (currentRun.seedIndex + 1) + "/" + task.sourceSeeds.length
            + ' Unit: ' + (unitIndex + 1) + "/" + task.sourceLength
            + ' Sum: ' +  totalScoresSum
            + ' Avg: ' + seedScoresAvg.toFixed(1)
            + ' Score: ',  JSON.stringify(game.moveScoreGet()));
        }
        game.board.clearLines();
        game.unit = undefined;

        if(logEnabled) {
          //game.display();
          //console.log(" ");
          console.log("unit completed");
        }
      }

    var t9 = require('./src/t9');
    var t9solution = t9(solution, powerPhrases || []);

    //solution = solution.substring(0, solution.length-1);
    var entry = {
      problemId : task.id,
      seed : seed,
      tag : 'cw_v18_pathfind' + task.id,
      solution : t9solution
    };
    answer.push(entry);

    seedScores.push(game.moveScoreGet().move_scores);
    totalScoresSum += game.moveScoreGet().move_scores;

    if (timeLimit) {
      let now = Date.now();
      if (now - (startTime + timeLimit) < 1000) {
        if (!useSimpleStartegy)
        useSimpleStartegy = true;
      } else if (now - (startTime + timeLimit) < 100) {
        break; // need time to record the results;
      }
    }

    if(singleSeedRun)
      break;
}

return {
  answer,
  seedScores
}
//++++++++++++++++
}

