"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model = def => ({
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
exports.default = model;
