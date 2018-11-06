"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parameterize = (obj) => {
    const output = {};
    for (const key of Object.keys(obj)) {
        output[key] = `$${key}`;
    }
    return output;
};
exports.ifFound = (middleware) => async (ctx, next) => {
    const result = await middleware(ctx, next);
    if (result !== undefined) {
        ctx.body = result;
    }
};
