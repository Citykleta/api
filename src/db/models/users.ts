import {ModelServiceFactory} from './types';

const model: ModelServiceFactory = def => ({
    table: 'users',
    columns: {
        id: 'serial',
        email: 'email',
        created_at: 'timestamp',
        updated_at: 'timestamp',
        password_hash: 'varchar',
        role_id: 'integer'
    },
    relations: {
        role: def.belongsTo('Roles', 'role_id'),
        businesses: def.belongsToMany('Businesses', 'BusinessOwners', 'user_id'),
        tokens: def.hasMany('Tokens')
    },
    searchable: ['email']
});

export default model;
