require("babel/register"); // don't put anything above this line!

// my-program.js
var nopt = require("nopt")
  , Stream = require("stream").Stream
  , path = require("path")
    , knownOpts = { "phrase" : [String, null]
                , "mem" : Number
                , "time" : Number
                , "file" : [String, Array]
                , "storm" : Boolean
                }
  , shortHands = { "p" : ["--phrase"]
                 , "m" : ["--mem"]
                 , "t" : ["--time"]
                 , "f" : ["--file"]
                 , "s" : ["--storm"]
                 }             
  , parsed = nopt(knownOpts, shortHands, process.argv, 2)

if(parsed.storm) {
	require("./storm.js")
	process.exit();
}

// TODO: solve problem here