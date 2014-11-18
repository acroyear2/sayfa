
var test = require('tape');
var sayfa = require('./');

test('sayfa', function (t) {
  function beep (ctx, next) {
    t.deepEqual(ctx, {
      cid: 'c1', hash: '#/beep', name: 'beep'
    });
    t.equal(typeof next, 'function');
    t.equal(window.location.hash, '#/beep');
    setTimeout(function () {
      window.location.assign('#/boop');
    }, 1);
  }
  function boop1 (ctx, next) {
    t.deepEqual(ctx, {
      cid: 'c2', hash: '#/boop', name: 'boop',
      previous: {
        cid: 'c1', hash: '#/beep', name: 'beep', previous: null
      }
    });
    t.equal(window.location.hash, '#/boop');
    next();
  }
  function boop2 (ctx) {
    t.end();
  }
  sayfa('/beep', beep);
  sayfa('/boop', boop1, boop2);
  t.equal(window.location.hash, '');
  sayfa.start({ default_hash: '#/beep' });
});
