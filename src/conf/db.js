"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conf = Object.freeze({
    host: process.env.POSTGRES_HOST || 'localhost',
    user: process.env.POSTGRES_USER || 'docker',
    password: process.env.POSTGRES_PASSWORD || 'docker',
    port: Number(process.env.POSTGRES_PORT) || 5432,
    database: process.env.POSTGRES_DB || 'citykleta'
});
