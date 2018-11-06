import {ModelServiceFactory} from './types';

const model: ModelServiceFactory = def => ({
    table: 'tokens',
    columns: {
        id: 'serial',
        value: 'string',
        expiration_date: 'timestamp',
        updated_at: 'timestamp',
        created_at: 'timestamp',
        revoked: 'boolean',
        user_id: 'integer',
        application_id: 'uuid'
    },
    relations: {
        user: def.belongsTo('Users', 'user_id'),
        application: def.belongsTo('Application', 'application_id')
    }
});

export default model;
