# A Simple Koa Router
[![NPM version][npm-version-image]][npm-url] 
[![NPM downloads][npm-downloads-image]][npm-url] 
[![Build Status][travis-image]][travis-url]
[![Coverage Status][coverage-image]][coverage-url]
[![MIT License][license-image]][license-url]

[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[npm-version-image]: http://img.shields.io/npm/v/cl-router.svg?style=flat
[npm-downloads-image]: http://img.shields.io/npm/dm/cl-router.svg?style=flat
[travis-image]: https://travis-ci.org/conglai/cl-router.svg?branch=master&t=11
[coverage-image]: https://coveralls.io/repos/github/conglai/cl-router/badge.svg?t=1


[license-url]: LICENSE
[npm-url]: https://npmjs.org/package/cl-router
[travis-url]:https://travis-ci.org/conglai/cl-router
[coverage-url]:https://coveralls.io/github/conglai/cl-router

## Install

`NodeJS >= 4.6.0`

```
~ npm install cl-router
```
> It's an better idea use this module with [clmloader](https://github.com/conglai/clmloader)

## Example

```
const middlewareMap = {
  'pre': {
    middlewares: [function*(next){
      this.num = this.num ? this.num + 1: 1;
      console.log('pre before next');
      yield next;
      console.log('pre before next');
    }]
  },
  'preA': {
    middlewares: [function*(next){
      this.num = 1;
      console.log('preA before next');
      yield next;
      console.log('preA after next');
    }]
  },
};
const routerMap = {
  'i': {
    error: {
      middlewares: ['pre', 'preA',function*(next){
        this.num += 1;
        console.log('error before next');
        yield next;
        console.log('error after next');
      }]
    }
  }
};
const routerM = routerFunc({
  middlewareMap: middlewareMap,
  routerMap: routerMap,
  defaultRouter: ['i', 'error']
});

const koa = require('koa');
const app = koa();

app.use(routerM);
app.listen(8080);
```

If you visit `http://localhost:8080/i/error`, console should output like this:

```
pre before next
preA before next
error before next
error after next
preA after next
pre before next
```
