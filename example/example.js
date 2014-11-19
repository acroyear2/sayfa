
var schema = {
  beep: {
    foo: 'int',
    bar: 'alpha_array'
  }
};

sayfa('/beep',
  function (ctx, next) {
    next();
  },
  function (ctx) {
    var el;
    if (!ctx.query)
      el = document.createTextNode('query is invalid');
    else
      el = document.createTextNode(JSON.stringify(ctx.query));
    var res = document.getElementById('res');
    decorate(res, el);   
  });

sayfa.start({ schema: schema });

function decorate (node, child) {
  while (node.hasChildNodes())
    node.removeChild(node.lastChild);
  node.appendChild(child);
}