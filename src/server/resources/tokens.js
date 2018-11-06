"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ship_hold_querybuilder_1 = require("ship-hold-querybuilder");
const common_types_1 = require("../lib/common-types");
const bcrypt_1 = require("bcrypt");
const tokens_1 = require("../lib/tokens");
const auth_1 = require("../middlewares/auth");
const utils_1 = require("../lib/utils");
exports.create = {
    method: "post" /* POST */,
    description: 'Create access token based on OAuth2 framework specification',
    path: '/',
    schema: {
        properties: {
            grant_type: { type: 'string' },
            username: { type: 'string', format: 'email' },
            password: { type: 'string' }
        },
        required: ['grant_type', 'username', 'password'],
        additionalProperties: false
    },
    handler: [auth_1.authenticateApplication(), async (ctx) => {
            const { Users, Tokens, Roles } = ctx.db;
            const { application } = ctx.state;
            const { grant_type, username, password } = ctx.request.body;
            if (grant_type !== 'password') {
                ctx.throw(400, { error: "unsupported_grant_type" /* UNSUPPORTED_GRANT_TYPE */ });
            }
            const [user] = await Users
                .select('id', 'email', 'password_hash')
                .where('email', '$email')
                .include(Roles)
                .run({ email: username });
            const isValid = user !== undefined ? bcrypt_1.compareSync(password, user.password_hash) : false;
            if (!user || !isValid) {
                return ctx.throw(400, { error: "invalid_grant" /* INVALID_GRANT */ });
            }
            //revoke all other tokens
            await Tokens.revoke(user.id, application.id);
            // create new one (both previous operations could be handled in a transaction)
            const [token] = await Tokens
                .insert({
                value: tokens_1.issue().value,
                user_id: user.id,
                application_id: application.id
            })
                .run();
            ctx.body = {
                access_token: token.value,
                token_type: 'bearer',
                expires_in: Math.floor(((new Date(token.expiration_date)).getTime() - Date.now()) / 1000),
                scope: user.role.title,
                user_id: user.id
                //refresh token: //todo
            };
        }]
};
exports.list = {
    method: "get" /* GET */,
    path: '/',
    schema: {
        properties: {
            page: common_types_1.page,
            size: common_types_1.size
        }
    },
    handler: [async (ctx) => {
            const { page, size } = ctx.query;
            const { Tokens } = ctx.db;
            const count = Tokens
                .select(ship_hold_querybuilder_1.aggregate.count('*'))
                .run();
            const users = Tokens
                .select()
                .page(page, size)
                .orderBy('created_at', 'desc')
                .run();
            ctx.body = {
                items: await users,
                count: +((await count)[0]).count
            };
        }]
};
exports.one = {
    method: "get" /* GET */,
    description: 'Introspection endpoint for tokens',
    path: '/:token',
    schema: {
        properties: {
            token: { type: 'string' }
        },
        required: ['token']
    },
    handler: [auth_1.authenticateApplication(), utils_1.ifFound(async (ctx) => {
            const { value } = ctx.params;
            const { Tokens, } = ctx.db;
            const [token] = await Tokens
                .select('value', 'scope', 'expiration_date', 'revoked', 'created_at', 'user_id', 'application_id')
                .where('value', '$value')
                .run({ value });
            return token;
        })]
};
