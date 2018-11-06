import {ModelServiceFactory} from './types';

const model: ModelServiceFactory = def => ({
    table: 'applications',
    columns: {
        id: 'uuid',
        type: {
            type: 'enum',
            values: ['confidential', 'public']
        },
        secret: {
            type: 'string'
        },
        createdAt: 'timestamp',
        updatedAt: 'timestamp',
        title: 'string'
    },
    relations: {
        tokens: def.hasMany('Tokens')
    }
});

export default model;
