
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
      window.location.assign('#/boop?f=1.2&b=onur%40example.com&ba=world&ba=dunya');
    }, 1);
  }
  function boop1 (ctx, next) {
    t.equal(ctx.cid, 'c2');
    t.equal(ctx.hash, '#/boop?f=1.2&b=onur%40example.com&ba=world&ba=dunya');
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
    default_hash: '#/beep',
    schema: {
      boop: {
        foo: 'double',
        bar: 'email',
        baz: 'alpha_array' 
      }
    }
  });
});
