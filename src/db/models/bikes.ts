import {ModelServiceFactory} from './types';

const model: ModelServiceFactory = def => ({
    table: 'bikes',
    columns: {
        id: 'serial',
        brand: 'string',
        business_id: 'integer',
        price: 'integer',
        fabrication_date: 'timestamp',
        acquisition_date: 'timestamp',
        created_at: 'timestamp',
        updated_at: 'timestamp',
    },
    relations: {
        owner: def.belongsTo('Businesses', 'business_id')
    },
    searchable: ['brand', 'owner.name']
});

export default model;
