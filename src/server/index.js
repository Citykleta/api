"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const koa = require("koa");
const mount = require("koa-mount");
const compress = require("koa-compress");
const logger = require("koa-logger");
const index_1 = require("../conf/index");
const app_js_1 = require("./app.js");
const fs_1 = require("fs");
const db_1 = require("../db");
const error_1 = require("./middlewares/error");
const mainApp = new koa();
mainApp.use(logger());
mainApp.use(compress());
mainApp.use(error_1.errorHandler());
// todo use proper cors implementation
mainApp.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', index_1.default.server.cors);
    ctx.set('Access-Control-Allow-Methods', 'PUT, OPTION, GET, DELETE');
    ctx.set('Access-Control-Allow-Headers', 'content-type, authorization');
    await next();
});
mainApp.context.db = {
    sh: db_1.default
};
for (const [name, model] of db_1.default) {
    mainApp.context.db[name] = model;
}
const apis = fs_1.readdirSync('./src/server/resources')
    .filter(n => !n.endsWith('.ts') && n !== 'types.js')
    .map(f => f.split('.'));
for (const [name, ext] of apis) {
    const api = app_js_1.default(require(`./resources/${name}.${ext}`));
    mainApp.use(mount(`/${name}`, api));
}
mainApp.listen(index_1.default.server.port);
