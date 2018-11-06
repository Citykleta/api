"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model = def => ({
    table: 'roles',
    columns: {
        id: { type: 'serial', primaryKey: true },
        title: 'string',
        permissions: 'jsonb'
    },
    relations: {
        users: def.hasMany('Users')
    }
});
exports.default = model;
