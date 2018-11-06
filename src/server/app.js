"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const koa = require("koa");
const jsonSchema = require("koa-json-schema");
const Router = require("koa-router");
const body = require("koa-bodyparser");
exports.default = (def) => {
    const app = new koa();
    const router = new Router();
    for (const d of Object.values(def)) {
        const { path, schema, method, handler } = d;
        const middleware = [jsonSchema(schema, { coerceTypes: true, useDefaults: true })].concat(handler);
        if (method === "post" /* POST */ || method === "put" /* PUT */) {
            middleware.unshift(body());
        }
        router[method](path, ...middleware);
    }
    app.use(router.routes());
    app.use(router.allowedMethods());
    return app;
};
