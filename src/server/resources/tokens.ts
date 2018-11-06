import {aggregate} from 'ship-hold-querybuilder';
import {page, size} from '../lib/common-types';
import {AuthErrorCode, EndpointDefinition, HttpMethod} from './types';
import {compareSync} from 'bcrypt';
import {issue} from '../lib/tokens';
import {authenticateApplication} from '../middlewares/auth';
import {ifFound} from '../lib/utils';

export const create: EndpointDefinition = {
    method: HttpMethod.POST,
    description: 'Create access token based on OAuth2 framework specification',
    path: '/',
    schema: {
        properties: {
            grant_type: {type: 'string'},
            username: {type: 'string', format: 'email'},
            password: {type: 'string'}
        },
        required: ['grant_type', 'username', 'password'],
        additionalProperties: false
    },
    handler: [authenticateApplication(), async ctx => {
        const {Users, Tokens, Roles} = ctx.db;
        const {application} = ctx.state;
        const {grant_type, username, password} = ctx.request.body;

        if (grant_type !== 'password') {
            ctx.throw(400, {error: AuthErrorCode.UNSUPPORTED_GRANT_TYPE});
        }

        const [user] = await Users
            .select('id', 'email', 'password_hash')
            .where('email', '$email')
            .include(Roles)
            .run({email: username});

        const isValid = user !== undefined ? compareSync(password, user.password_hash) : false;

        if (!user || !isValid) {
            return ctx.throw(400, {error: AuthErrorCode.INVALID_GRANT});
        }

        //revoke all other tokens
        await Tokens.revoke(user.id, application.id);

        // create new one (both previous operations could be handled in a transaction)
        const [token] = await Tokens
            .insert({
                value: issue().value,
                user_id: user.id,
                application_id: application.id
            })
            .run();

        ctx.body = {
            access_token: token.value,
            token_type: 'bearer',
            expires_in: Math.floor(((new Date(token.expiration_date)).getTime() - Date.now()) / 1000),
            scope: user.role.title,
            user_id:user.id
            //refresh token: //todo
        };
    }]
};

export const list: EndpointDefinition = {
    method: HttpMethod.GET,
    path: '/',
    schema: {
        properties: {
            page,
            size
        }
    },
    handler: [async ctx => {
        const {page, size} = ctx.query;
        const {Tokens} = ctx.db;
        const count = Tokens
            .select(aggregate.count('*'))
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

export const one: EndpointDefinition = {
    method: HttpMethod.GET,
    description: 'Introspection endpoint for tokens',
    path: '/:token',
    schema: {
        properties: {
            token: {type: 'string'}
        },
        required: ['token']
    },
    handler: [authenticateApplication(), ifFound(async ctx => {
        const {value} = ctx.params;
        const {Tokens,} = ctx.db;
        const [token] = await Tokens
            .select('value', 'scope', 'expiration_date', 'revoked', 'created_at', 'user_id', 'application_id')
            .where('value', '$value')
            .run({value});

        return token;
    })]
};
