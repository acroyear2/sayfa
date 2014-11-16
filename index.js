
module.exports = route;

var qs = require('tetsuo/node-querystring@master');
var ware = require('segmentio/ware@1.0.1')();
var uid = require('tetsuo/uid@0.1.1');
var validate = require('./validate');
var compact = require('./compact');
var unmangle = require('./unmangle');
var schema = require('./config.json').schema;

var fragment = /^#([\/A-Za-z0-9-]+)(?:;(.+))*/;
var qs_sep = ';';
var started;

function middleware (path, fn) {
  return function (ctx, next) {
    var matchset = fragment.exec(ctx.hash);
    if (matchset && matchset[1] === path) {
      if (!ctx.hasOwnProperty('name'))
        ctx.name = path.substr(1);
      if (matchset[2] && !ctx.hasOwnProperty('query'))
        ctx.query = parse(ctx.name, matchset[2]);
      return fn(ctx, next);
    }
    next();
  };
}

function parse (path, attrs) {
  var keys = Object.keys(schema[path]);
  attrs = qs.parse(attrs, { separator: qs_sep });
  attrs = unmangle(attrs, keys);
  attrs = compact(attrs, function (v, k) {
    if (typeof v === 'undefined') return;
    return validate(k, v, schema[path][k]);
  });
  return attrs;
}

function route (path, fn) {
  for (var i = 1; i < arguments.length; ++i) {
    ware.use(middleware(path, arguments[i]));
  }
}

route.start = function (options) {
  if (started) return;
  started = true;
  
  options || (options = {});

  if (!/^#\/\w+(;.+)*$/.test(window.location.hash))
    options.hash = options.default_hash || '#/home';

  if (options.hash)
    window.location.assign(options.hash);

  setImmediate(function () { 
    window.addEventListener('hashchange', route.dispatch); 
  });
  route.dispatch();
};

var ctxs = [];

route.dispatch = function () {
  var ctx = { cid: uid('c'), hash: window.location.hash };
  ctxs.push(ctx);

  if (ctxs.length > 1) {
    var previous = ctxs.shift();
    previous.previous = null;
    ctx.previous = previous;
  }
  
  ware.run(ctxs[0], function (err, res) {
    console.log(res);
    if (err) throw err;
  });
};
