import * as koa from 'koa';
import * as mount from 'koa-mount';
import * as compress from 'koa-compress';
import * as logger from 'koa-logger';
import conf from '../conf/index';
import app from './app.js';
import {readdirSync} from 'fs';
import sh from '../db';
import {errorHandler} from './middlewares/error';

const mainApp = new koa();
mainApp.use(logger());
mainApp.use(compress());
mainApp.use(errorHandler());

// todo use proper cors implementation
mainApp.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', conf.server.cors);
    ctx.set('Access-Control-Allow-Methods', 'PUT, OPTION, GET, DELETE');
    ctx.set('Access-Control-Allow-Headers', 'content-type, authorization');
    await next();
});

mainApp.context.db = {
    sh
};

for (const [name, model] of sh) {
    mainApp.context.db[name] = model;
}

const apis = readdirSync('./src/server/resources')
    .filter(n => !n.endsWith('.ts') && n !== 'types.js')
    .map(f => f.split('.'));


for (const [name, ext] of apis) {
    const api = app(require(`./resources/${name}.${ext}`));
    mainApp.use(mount(`/${name}`, api));
}

mainApp.listen(conf.server.port);
