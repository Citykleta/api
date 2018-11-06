"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model = def => ({
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
exports.default = model;
