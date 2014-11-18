
module.exports = sayfa;

var ware = require('ware')();
var uid = require('uid3');

var fragment = /^#([\/A-Za-z0-9-]+)(?:\?(.+))*/;
var started;

function middleware (path, fn) {
  return function (ctx, next) {
    var matchset = fragment.exec(ctx.hash);
    if (matchset && matchset[1] === path) {
      if (!ctx.hasOwnProperty('name'))
        ctx.name = path.substr(1);
      return fn(ctx, next);
    }
    next();
  };
}

function sayfa (path, fn) {
  for (var i = 1; i < arguments.length; ++i) {
    ware.use(middleware(path, arguments[i]));
  }
}

sayfa.start = function (opts) {
  if (started) return;
  
  started = true;
  
  opts || (opts = {});

  if (!fragment.test(window.location.hash))
    opts.hash = opts.default_hash || '#/home';

  if (opts.hash)
    window.location.assign(opts.hash);

  process.nextTick(function () { 
    window.addEventListener('hashchange', sayfa.dispatch); 
  });

  sayfa.dispatch();
};

var ctxs = [];

sayfa.dispatch = function () {
  var ctx = { 
    cid: uid('c'),
    hash: window.location.hash
  };
  ctxs.push(ctx);

  if (ctxs.length > 1) {
    var previous = ctxs.shift();
    previous.previous = null;
    ctx.previous = previous;
  }
  
  ware.run(ctxs[0], function (err, res) {
    if (err) throw err;
  });
};