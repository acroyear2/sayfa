# sayfa [![Build Status](https://travis-ci.org/tetsuo/sayfa.svg?branch=master)](https://travis-ci.org/tetsuo/sayfa)

a minimal router that plays well with [mengene](https://github.com/tetsuo/mengene).

## api

### sayfa(path, fn, [, fn...])

`path` should be in form /foo

You can pass an arbitrary number of `fn`s. They will be run in the [ware](https://github.com/segmentio/ware) context. So `fn` can be a synchronous, asynchronous, or a generator function. See [ware](https://github.com/segmentio/ware).

Example:

```js
sayfa('/foo',
  function (ctx, next) {
    // ...
  },
  function (ctx) {
    // ...
  })
```

Passed `ctx` object holds `name`, `hash`, a unique `cid` and a `query` object if query string is valid against the given schema.

### sayfa.start(opts)

Currently only option is `schema`, which should be in the following form:

Example:

```js
var schema = {
  foo: {
    bar: 'int',
    baz: 'alpha_array'
  }
};
```

See [validate](https://github.com/tetsuo/validate) for allowed types.

Given this schema `#/foo?b=1&ba=beep&ba=boop` will be deserialized to `{ bar: 1, baz: ['beep', 'boop']}`.

## Status

I haven't tested `sayfa` on any production yet. This was just an idea that came up while talking with a colleague; all contributions are welcomed :)

API is pretty much inspired by [page.js](https://github.com/visionmedia/page.js), so if you are looking for a more robust alternative, I suggest you to go with it.

## License

The MIT License (MIT)

Copyright (c) 2014 Onur Gunduz ogunduz@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.