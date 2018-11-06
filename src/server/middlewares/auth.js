"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const basic = require("basic-auth");
const bearer_auth_1 = require("../lib/bearer-auth");
exports.authenticateApplication = () => async (ctx, next) => {
    const { Applications } = ctx.db;
    try {
        const { name, pass } = basic(ctx.req);
        const [app] = await Applications
            .select('id', 'secret', 'title')
            .where('id', '$name')
            .and('secret', '$pass')
            .debug({ name, pass });
        if (!app) {
            throw new Error('invalid credentials');
        }
        ctx.state.application = { id: app.id, title: app.title };
    }
    catch (e) {
        console.log(e);
        return ctx.throw(400, "invalid_client" /* INVALID_CLIENT */);
    }
    await next();
};
exports.authorize = (permissions = {}) => async (ctx, next) => {
    try {
        const tokenValue = bearer_auth_1.auth(ctx);
        const { Tokens, Users, Roles } = ctx.db;
        const [token] = await Tokens.select('id', 'expiration_date', 'revoked', 'value')
            .where('value', '$value')
            .include(Users
            .select('id', 'role_id')
            .include(Roles))
            .run({ value: tokenValue });
        if (!token) {
            throw new Error('Could not find matching token');
        }
        if (token.revoked || (new Date(token.expiration_time)).getTime() < Date.now()) {
            throw new Error('Token is revoked or invalid');
        }
        //todo: actually compare token with granted permission permissions;
        ctx.state.token = token;
        await next();
    }
    catch (e) {
        return ctx.throw(403, e.message);
    }
};
