"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// todo use a proper logger
exports.errorHandler = () => async (ctx, next) => {
    try {
        await next();
    }
    catch (e) {
        console.error(e);
        ctx.status = e.status || 500;
        ctx.body = e; // todo dev mode vs prod
    }
};
