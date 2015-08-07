const chai = require('chai'),
    assert = chai.assert,
    expect = chai.expect;

describe('Simple Tests', () => {
  const asyncTest = f => done => f().then(done).catch(done);

  it('should pass', () => {
    expect(1 + '').to.equal(`1`);
  });

  it('should run async tests', done => {
    setTimeout(() => done(), 10);
  });

  it('should run async ... await code', asyncTest(async () => {
    const a = await 2; // can be async operation
    expect(a).to.equal(2);
  }));
});
