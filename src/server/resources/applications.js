"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ship_hold_querybuilder_1 = require("ship-hold-querybuilder");
const common_types_1 = require("../lib/common-types");
const utils_1 = require("../lib/utils");
const safeProps = ['id', 'type', 'created_at', 'updated_at', 'title'];
exports.list = {
    method: "get" /* GET */,
    description: 'Create a new Client application',
    path: '/',
    schema: {
        properties: {
            page: common_types_1.page,
            size: common_types_1.size
        }
    },
    handler: [async (ctx) => {
            const { page, size } = ctx.query;
            const { Applications } = ctx.db;
            const builder = Applications
                .select(...safeProps)
                .orderBy('updated_at', 'desc')
                .page(page, size);
            const count = Applications.select(ship_hold_querybuilder_1.aggregate.count('*'))
                .run();
            ctx.body = {
                items: await builder.run(),
                count: +((await count)[0]).count
            };
        }]
};
exports.one = {
    method: "get" /* GET */,
    description: 'Get details for a particular client application',
    path: '/:id',
    schema: {
        properties: {
            id: { type: 'string', format: 'uuid' }
        },
        required: ['id']
    },
    handler: [utils_1.ifFound(async (ctx) => {
            const { id } = ctx.params;
            const { Applications } = ctx.db;
            const [app] = await Applications
                .select(...safeProps)
                .where('id', '$id')
                .run({ id });
            return app;
        })]
};
exports.remove = {
    method: "delete" /* DELETE */,
    path: '/:id',
    description: 'Delete an existing client application',
    schema: {
        properties: { id: { type: 'string', format: 'uuid' } },
        required: ['id'],
    },
    handler: [async (ctx) => {
            const { id } = ctx.params;
            const { Applications } = ctx.db;
            const [app] = await Applications
                .select('id')
                .where('id', '$id')
                .run({ id });
            if (!app) {
                return ctx.throw(404, 'could not find the client application');
            }
            await Applications
                .delete()
                .where('id', '$id')
                .run({ id });
        }]
};
