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
    const path = 'daaakamakmmmaamaambbb';
    expect(t9(path)).to.equal('digitalismmmialialbbb')
  });

  it('should use custom power words', () => {
    const path = 'mmmmmmmmmbbmmmmmmmmmbmmmmmmbdmbbapmmmambaammmmmbaaaaammmmbaammdmmdambaamamadmabaaaaaambaaaaapambmmmmdabmadammbmddmmmmabaaaammkkmbaaaadadabaaaaaakmabmmammakaabmmmmbmkmbmmmmkkkmbmmbaaaamabaaapkaaambmmmmdmmdmbaaammmmbaaaakkamabmmmmmbbbmmmmddmmmbmmmmbmbaaaaddammbaaaaaakabmammaadmbmmmmmkkmbmbmaammaabaaaaadadpabaaaaapammbmmmmmkaabaaakmmmambaialialmbaaaaadmabmmmmmbmkkmbbbmmmmmmbbmmmmmbaaaaakkaaabmmmdaaadmbmmmmaamkmbaamadmabaaaamdmabaaakapambmmmmmdabmmmbkmmmbmmmmmbbbmmmmabaaaaadadabmmmadabmdaabadapaaabmmmmbkbmbmadadmaabaaaaapabmmmdmmbaapadaabmbmmabmmbbmbbmadaambmmbbmbaaaakabmmabbdmbbbbmmmbdaab';
    expect(t9(path)).to.equal('mmmmmmmmmbbmmmmmmmmmbmmmmmmbdmbei!mmmambaammmmmbaaaaammmmbaammdmmdambaamamadmabaaaaaambaaaaapambmmmmdabmadammbmddmmmmabaaaammkkmbaaaadadabaaaaaakmabmmammakaabmmmmbmkmbmmmmkkkmbmmbaaaamabaaapkaaambmmmmdmmdmbaaammmmbaaaakkamabmmmmmbbbmmmmddmmmbmmmmbmbaaaaddammbaaaaaakabmammaadmbmmmmmkkmbmbmaammaabaaaaadadpabaaaaapammbmmmmmkaabaaakmmmambaialialmbaaaaadmabmmmmmbmkkmbbbmmmmmmbbmmmmmbaaaaakkaaabmmmdaaadmbmmmmaamkmbaamadmabaaaamdmabaaakapambmmmmmdabmmmbkmmmbmmmmmbbbmmmmabaaaaadadabmmmadabmdaabadapaaabmmmmbkbmbmadadmaabaaaaapabmmmdmmbaapadaabmbmmabmmbbmbbmadaambmmbbmbaaaakabmmabbdmbbbbmmmbdaab');
    expect(t9(path, ['olnoy', 'fajih', 'nofija'])).to.equal('mmmmmolnoybmmmmmolnoymmolnoydmbei!mmmambaammmnofijaaaolnoyaammdmmdambaamamadmafajihaamfajihapambmmmmdabmadammbmddmmmmafajihmmkkmfajihdadafajihaakmabmmammakaabolnoymkmbmmmmkkkmbnofijaamabaaapkaaambmmmmdmmdmbaaammnofijaakkamabmolnoybbmmmmddmmmbolnoymfajihddanofijaaaakabmammaadmbmmmmmkkmbmbmaammaafajihadadpafajihapammbmmmmmkaabaaakmmmambaialialmfajihadmabmolnoymkkmbbbmmolnoybmmmnofijaaakkaaabmmmdaaadmbmmmmaamkmbaamadmafajihmdmabaaakapambmmmmmdabmmmbkmmmbmolnoybbmmmmafajihadadabmmmadabmdaabadapaaabolnoykbmbmadadmaafajihapabmmmdmmbaapadaabmbmmabmmbbmbbmadaambmmbbmfajihkabmmabbdmbbbbmmmbdaab');
  });
});
