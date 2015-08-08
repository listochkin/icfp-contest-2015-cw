# icfp-contest-2015-cw

ICFP Contest 2015 entry by cw team 

[![Circle CI](https://circleci.com/gh/listochkin/icfp-contest-2015-cw.svg?style=svg&circle-token=d69ad3b0095bc3e87d1d73c2a3bdce3696165949)](https://circleci.com/gh/listochkin/icfp-contest-2015-cw)

# Trello Board

https://trello.com/b/Ic5qbgYr/icfpc-2015

# How to launch App from Sublime

  - Goto Tools->Build System->New
  - Enter command, for example
  {
	"shell_cmd": "node play_icfp2015 -f problems/problem_0.json -l 
  }
  - Press Ctrl+B
  - Open build.log and see results instantly!
 

# development

  - Install Node 0.12 or iojs && `npm install`
  - `npm run watch` - rerun tests on file change
  - `npm run cover` - to generate a caverage report. See it in `coverage/lcov-report/index.html`
  - `npm start` - run the app

