"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ship_hold_querybuilder_1 = require("ship-hold-querybuilder");
const common_types_1 = require("../lib/common-types");
const utils_1 = require("../lib/utils");
exports.create = {
    method: "post" /* POST */,
    description: 'Create a new business',
    path: '/',
    schema: {
        properties: {
            name: { type: 'string' },
            owner: { type: 'integer' }
        },
        required: ['name'],
        additionalProperties: false
    },
    handler: [async (ctx) => {
            const { Users, Businesses } = ctx.db;
            const { name, owner } = ctx.request.body;
            //todo
        }]
};
exports.list = {
    method: "get" /* GET */,
    description: 'List existing businesses',
    path: '/',
    schema: {
        properties: {
            page: common_types_1.page,
            size: common_types_1.size
        }
    },
    handler: [async (ctx) => {
            const { page, size } = ctx.query;
            const { Businesses } = ctx.db;
            const count = Businesses.select(ship_hold_querybuilder_1.aggregate.count('*')).run();
            const users = Businesses
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
    description: 'Get details for a particular business',
    path: '/:id',
    schema: {
        properties: {
            id: common_types_1.id
        },
        required: ['id']
    },
    handler: [utils_1.ifFound(async (ctx) => {
            const { id } = ctx.params;
            const { Businesses, Bikes } = ctx.db;
            const [business] = await Businesses
                .select()
                .where('id', '$id')
                .include(Bikes)
                .run({ id });
            return business;
        })]
};
