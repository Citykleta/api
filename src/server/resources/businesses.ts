import {aggregate} from 'ship-hold-querybuilder';
import {id, page, size} from '../lib/common-types';
import {EndpointDefinition, HttpMethod} from './types';
import {ifFound} from '../lib/utils';

export const create: EndpointDefinition = {
    method: HttpMethod.POST,
    description:'Create a new business',
    path: '/',
    schema: {
        properties: {
            name: {type: 'string'},
            owner: {type: 'integer'}
        },
        required: ['name'],
        additionalProperties: false
    },
    handler: [async ctx => {
        const {Users, Businesses} = ctx.db;
        const {name, owner} = ctx.request.body;
        //todo
    }]
};

export const list: EndpointDefinition = {
    method: HttpMethod.GET,
    description:'List existing businesses',
    path: '/',
    schema: {
        properties: {
            page,
            size
        }
    },
    handler: [async ctx => {
        const {page, size} = ctx.query;
        const {Businesses} = ctx.db;
        const count = Businesses.select(aggregate.count('*')).run();
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

export const one: EndpointDefinition = {
    method: HttpMethod.GET,
    description: 'Get details for a particular business',
    path: '/:id',
    schema: {
        properties: {
            id
        },
        required: ['id']
    },
    handler: [ifFound(async ctx => {
        const {id} = ctx.params;
        const {Businesses, Bikes} = ctx.db;
        const [business] = await Businesses
            .select()
            .where('id', '$id')
            .include(Bikes)
            .run({id});

        return business;
    })]
};
