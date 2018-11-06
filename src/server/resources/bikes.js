"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ship_hold_querybuilder_1 = require("ship-hold-querybuilder");
const common_types_1 = require("../lib/common-types");
const utils_1 = require("../lib/utils");
exports.create = {
    method: "post" /* POST */,
    description: 'Create a new bike',
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
    description: 'List existing bikes',
    path: '/',
    schema: {
        properties: {
            page: common_types_1.page,
            size: common_types_1.size,
            search: common_types_1.search
        }
    },
    handler: [async (ctx) => {
            const { page, search, size } = ctx.query;
            const { Bikes, Businesses } = ctx.db;
            const count = Bikes.select(ship_hold_querybuilder_1.aggregate.count('*')).run();
            const users = Bikes
                .select()
                .include(Businesses.select('id', 'name'))
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
    description: 'Get details for a particular bike',
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
            const [bike] = await Bikes
                .select()
                .where('id', '$id')
                .include(Businesses)
                .run({ id });
            return bike;
        })]
};
