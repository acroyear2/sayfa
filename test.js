
var test = require('tape');
var sayfa = require('./');

test('sayfa', function (t) {
  function beep (ctx, next) {
    t.equal(ctx.hash, '#/beep');
    t.equal(ctx.name, 'beep');
    t.equal(typeof next, 'function');
    setTimeout(function () {
      window.location.assign('#/boop?f=1.2&b=onur@example.com&ba=world&ba=dunya');
    }, 1);
  }
  function boop1 (ctx, next) {
    t.equal(ctx.hash, '#/boop?f=1.2&b=onur@example.com&ba=world&ba=dunya');
    t.equal(ctx.name, 'boop');
    next();
  }
  function boop2 (ctx) {
    t.deepEqual(ctx.query, {
      foo: '1.2',
      bar: 'onur@example.com',
      baz: ['world', 'dunya']
    });
    t.end();
  }
  sayfa('/beep', beep);
  sayfa('/boop', boop1, boop2);
  sayfa('/')
  t.equal(window.location.hash, '');
  sayfa.start({
    schema: {
      boop: {
        foo: 'double',
        bar: 'email',
        baz: 'alpha_array' 
      }
    }
  });
  window.location.assign('#/beep');
});
