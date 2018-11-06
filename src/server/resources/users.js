"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ship_hold_querybuilder_1 = require("ship-hold-querybuilder");
const common_types_1 = require("../lib/common-types");
const email = { type: 'string', format: 'email' };
exports.create = {
    method: "post" /* POST */,
    description: 'Create a user',
    path: '/',
    schema: {
        properties: {
            email
        },
        required: ['email'],
        additionalProperties: false
    },
    handler: [async (ctx) => {
            const { Users } = ctx.db;
            const { email } = ctx.request.body;
            const [user] = await Users
                .select('id')
                .where('email', '$email')
                .run({ email });
            if (user) {
                ctx.throw(409, `There is already a user with the provided email`, { email });
            }
        }, async (ctx) => {
            const { Users } = ctx.db;
            const builder = Users
                .insert()
                .value('email', `$${email}`);
            ctx.body = await builder.run(ctx.request.body)[0];
        }]
};
exports.list = {
    method: "get" /* GET */,
    path: '/',
    description: 'List users',
    schema: {
        properties: {
            page: common_types_1.page,
            size: common_types_1.size,
            search: common_types_1.search
        }
    },
    handler: [async (ctx) => {
            const { page, search, size } = ctx.query;
            const { Users } = ctx.db;
            const count = Users.select(ship_hold_querybuilder_1.aggregate.count('*')).run();
            const users = Users
                .select('id', 'email', 'created_at', 'updated_at', 'role_id')
                .include('businesses', 'role')
                .search(search)
                .page(page, size)
                .orderBy('created_at', 'desc')
                .run({ search: `%${search}%` });
            ctx.body = {
                items: await users,
                count: +((await count)[0]).count
            };
        }]
};
exports.one = {
    method: "get" /* GET */,
    description: 'Get details for a particular user',
    path: '/:id',
    schema: {
        properties: {
            id: common_types_1.id
        },
        required: ['id']
    },
    handler: [async (ctx) => {
            const { id } = ctx.params;
            const { Users } = ctx.db;
            const [user] = await Users
                .select()
                .where('id', '$id')
                .include('role', 'businesses')
                .run({ id });
            if (user !== undefined) {
                const { password_hash } = user, safeUser = __rest(user, ["password_hash"]);
                ctx.body = safeUser;
            }
        }]
};
