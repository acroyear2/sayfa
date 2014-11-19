
module.exports = sayfa;

var querystring = require('querystring');
var ware = require('ware')();
var validate = require('validate3');
var mengene = require('mengene');
var uid = require('uid3');

var fragment = /^#([\/A-Za-z0-9-]+)(?:\?(.+))*/;
var started, schema;

function middleware (path, fn) {
  return function (ctx, next) {
    var matchset = fragment.exec(ctx.hash);
    if (matchset && matchset[1] === path) {
      if (!ctx.hasOwnProperty('name'))
        ctx.name = path.substr(1);
      if (schema && matchset[2] && !ctx.hasOwnProperty('query'))
        ctx.query = parse(ctx.name, matchset[2]);
      return fn(ctx, next);
    }
    next();
  };
}

function parse (path, attrs) {
  var keys = Object.keys(schema[path]);
  attrs = querystring.parse(attrs);
  attrs = mengene.decompress(attrs, keys);
  attrs = compact(attrs, function (v, k) {
    if (typeof v === 'undefined') return;
    return validate(k, v, schema[path][k]);
  });
  return attrs;
}

function compact (val, fn) {
  var keys = Object.keys(val);
  return keys.reduce(function (a, k, i) {
    var v = val[k];
    if (fn) v = fn(v, k);
    if (v || v === 0) a[k] = v;
    return a;
  }, {});
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

  schema = opts.schema;

  if (!fragment.test(window.location.hash))
    opts.hash = opts.default_hash || '#/home';

  if (opts.hash) {
    process.nextTick(function () {
      window.location.assign(opts.hash);
    });
  }

  window.addEventListener('hashchange', sayfa.dispatch);
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