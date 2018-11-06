import {ModelServiceFactory} from './types';

const model: ModelServiceFactory = def => ({
    table: 'business_owners',
    columns: {
        id: 'serial',
        user_id: 'integer',
        business_id: 'integer',
        created_at: 'timestamp',
        updated_at: 'timestamp',
    },
    relations: {
        owners: def.belongsToMany('Users', 'BusinessOwners', 'business_id')
    }
});

export default model;
