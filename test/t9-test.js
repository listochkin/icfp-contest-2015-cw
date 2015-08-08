const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect;

var t9 = require('../src/t9');

describe('T9', () => {
  it('should not replace anything if no power words present', () => {
    const path = 'aaa';
    expect(t9(path)).to.equal(path);
  });

  it('should find power words', () => {
    const a = t9.reverseT9('ei!');
    console.log(t9.reversePowerWords);
    const path = 'daaakamakmmmaamaambbb';
    expect(t9(path)).to.equal('digitalismmmialialbbb')
  })
});
