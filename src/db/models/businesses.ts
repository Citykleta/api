import {ModelServiceFactory} from './types';

const model: ModelServiceFactory = def => ({
    table: 'businesses',
    columns: {
        id: 'serial',
        name: 'varchar',
        created_at: 'timestamp',
        updated_at: 'timestamp',
    },
    relations: {
        owners: def.belongsToMany('Users', 'BusinessOwners', 'business_id'),
        bikes: def.hasMany('Bikes')
    }
});

export default model;
