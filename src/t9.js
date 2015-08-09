function t9(path, priorityWords) {
  var words = [...byLength(priorityWords), ...byLength(powerWords)];
  var reverse = reversePowerWords(words);
  for (let word in reverse) {
    path = replaceAll(word, reverse[word], path);
  }
  return path;
}

t9.encoding = {
  W : "p",
  E : "b",
  SW : "a",
  SE : "m",
  CW : "d",
  CCW : "k"
};

module.exports = t9;

const moves = {
  p: ['p', "'", '!', '.', '0', '3'],
  b: ['b', 'c', 'e', 'f', 'y', '2'],
  a: ['a', 'g', 'h', 'i', 'j', 4],
  m: ['l', 'm', 'n', 'o', ' ', '5'],
  d: ['d', 'q', 'r', 'v', 'z', '1'],
  k: ['k', 's', 't', 'u', 'w', 'x']
};

const powerWords = [
  'ei!',
  'ialial',
  'bamm',
  "r'lyeh",
  'yuggoth',
  'digitalis'
];

function reversePowerWords (powerWords) {
  return powerWords.reduce((words, word) => {
    const rw = reverseT9(word);
    words[rw] = word;
    return words;
  }, {});
}

function reverseT9(s) {
  return s.split('').map(c => Object.keys(moves).filter(key => moves[key].indexOf(c) >= 0)).join('');
}

function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function byLength (array) {
  if (!array) return [];
  return array.sort((a, b) => b.length - a.length);
}

