import {ModelServiceFactory} from './types';

const model: ModelServiceFactory = def => ({
    table: 'roles',
    columns: {
        id: {type: 'serial', primaryKey: true},
        title: 'string',
        permissions: 'jsonb'
    },
    relations: {
        users: def.hasMany('Users')
    }
});

export default model;
