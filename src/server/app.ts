import * as koa from 'koa';
import * as jsonSchema from 'koa-json-schema';
import * as Router from 'koa-router';
import * as body from 'koa-bodyparser';
import {EndpointDefinition, HttpMethod} from './resources/types';

interface AppEndpoint {
    [key: string]: EndpointDefinition
}

export default (def: AppEndpoint) => {
    const app = new koa();
    const router = new Router();
    for (const d of Object.values(def)) {
        const {path, schema, method, handler} = d;
        const middleware = [jsonSchema(schema, {coerceTypes: true, useDefaults: true})].concat(handler);

        if (method === HttpMethod.POST || method === HttpMethod.PUT) {
            middleware.unshift(body());
        }
        router[method](path, ...middleware);
    }
    app.use(router.routes());
    app.use(router.allowedMethods());
    return app;
};
