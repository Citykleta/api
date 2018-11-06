import {aggregate} from 'ship-hold-querybuilder';
import {id, page, search, size} from '../lib/common-types';
import {EndpointDefinition, HttpMethod} from './types';

const email = {type: 'string', format: 'email'};

export const create: EndpointDefinition = {
    method: HttpMethod.POST,
    description: 'Create a user',
    path: '/',
    schema: {
        properties: {
            email
        },
        required: ['email'],
        additionalProperties: false
    },
    handler: [async ctx => {
        const {Users} = ctx.db;
        const {email} = ctx.request.body;
        const [user] = await Users
            .select('id')
            .where('email', '$email')
            .run({email});

        if (user) {
            ctx.throw(409, `There is already a user with the provided email`, {email});
        }
    }, async ctx => {
        const {Users} = ctx.db;

        const builder = Users
            .insert()
            .value('email', `$${email}`);

        ctx.body = await builder.run(ctx.request.body)[0];
    }]
};

export const list = {
    method: HttpMethod.GET,
    path: '/',
    description: 'List users',
    schema: {
        properties: {
            page,
            size,
            search
        }
    },
    handler: [async ctx => {
        const {page, search, size} = ctx.query;
        const {Users} = ctx.db;
        const count = Users.select(aggregate.count('*')).run();
        const users = Users
            .select('id', 'email', 'created_at', 'updated_at', 'role_id')
            .include('businesses', 'role')
            .search(search)
            .page(page, size)
            .orderBy('created_at', 'desc')
            .run({search: `%${search}%`});

        ctx.body = {
            items: await users,
            count: +((await count)[0]).count
        };
    }]
};

export const one: EndpointDefinition = {
    method: HttpMethod.GET,
    description: 'Get details for a particular user',
    path: '/:id',
    schema: {
        properties: {
            id
        },
        required: ['id']
    },
    handler: [async ctx => {
        const {id} = ctx.params;
        const {Users} = ctx.db;
        const [user] = await Users
            .select()
            .where('id', '$id')
            .include('role', 'businesses')
            .run({id});

        if (user !== undefined) {
            const {password_hash, ...safeUser} = user;
            ctx.body = safeUser;
        }
    }]
};
