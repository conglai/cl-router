'use strict';
const rootPath = TEST_GLOBAL.rootPath;
const routerFunc = require(`${rootPath}/`);
const co = require('co');
const sinon = require('sinon');
const koa = require('koa');
const request = require('supertest');

describe('基础路由中间件', () => {
  let routerM, routerMap, middlewareMap;
  beforeEach(() => {
    middlewareMap = {
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
    routerMap = {
      'i': {
        error: {
          middlewares: ['pre', 'preA',function*(next){
            this.num += 1;
            console.log('error before next');
            yield next;
            console.log('error after next');
          }]
        },
        example: {
          commonMiddlewares: ['preA'],
          middlewares: ['pre',function*(next){
            this.num += 2;
            yield next;
          }]
        },
      }
    };
    routerM = routerFunc({
      middlewareMap: middlewareMap,
      routerMap: routerMap,
      defaultRouter: ['i', 'error']
    });
  });
  it('调用默认的路由', () => {
    let app = koa();
    app.use(routerM);
    app.use(function*(next){
      let ctx = this;
      ctx.num.should.be.equal(2);
      ctx.gRouter.should.be.equal(routerMap.i.error);
      ctx.gRouterKeys.should.be.eql(['i', 'error']);
      ctx.body = 'hey';
      yield next;
    });
    return request(app.listen())
      .get('/')
      .expect(200);
  });
  it('调用/i/example', () => {
    let app = koa();
    app.use(routerM);
    app.use(function*(next){
      let ctx = this;
      ctx.num.should.be.equal(4);
      ctx.gRouter.should.be.equal(routerMap.i.example);
      ctx.gRouterKeys.should.be.eql(['i', 'example']);
      ctx.body = 'hey';
      yield next;
    });
    return request(app.listen())
      .get('/i/example')
      .expect(200);
  });

});

