"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model = def => ({
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
exports.default = model;
