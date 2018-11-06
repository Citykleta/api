import {aggregate} from 'ship-hold-querybuilder';
import {EndpointDefinition, HttpMethod} from './types';
import {page, size} from '../lib/common-types';
import {ifFound} from '../lib/utils';

const safeProps = ['id', 'type', 'created_at', 'updated_at', 'title'];

export const list: EndpointDefinition = {
    method: HttpMethod.GET,
    description: 'Create a new Client application',
    path: '/',
    schema: {
        properties: {
            page,
            size
        }
    },
    handler: [async ctx => {
        const {page, size} = ctx.query;
        const {Applications} = ctx.db;
        const builder = Applications
            .select(...safeProps)
            .orderBy('updated_at', 'desc')
            .page(page, size);

        const count = Applications.select(aggregate.count('*'))
            .run();

        ctx.body = {
            items: await builder.run(),
            count: +((await count)[0]).count
        };
    }]
};

export const one: EndpointDefinition = {
    method: HttpMethod.GET,
    description: 'Get details for a particular client application',
    path: '/:id',
    schema: {
        properties: {
            id: {type: 'string', format: 'uuid'}
        },
        required: ['id']
    },
    handler: [ifFound(async ctx => {
        const {id} = ctx.params;
        const {Applications} = ctx.db;
        const [app] = await Applications
            .select(...safeProps)
            .where('id', '$id')
            .run({id});

        return app;
    })]
};

export const remove: EndpointDefinition = {
    method: HttpMethod.DELETE,
    path: '/:id',
    description: 'Delete an existing client application',
    schema: {
        properties: {id: {type: 'string', format: 'uuid'}},
        required: ['id'],
    },
    handler: [async ctx => {
        const {id} = ctx.params;
        const {Applications} = ctx.db;
        const [app] = await Applications
            .select('id')
            .where('id', '$id')
            .run({id});

        if (!app) {
            return ctx.throw(404, 'could not find the client application');
        }

        await Applications
            .delete()
            .where('id', '$id')
            .run({id});
    }]
};
