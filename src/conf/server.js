"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conf = Object.freeze({
    port: Number(process.env.SERVER_PORT) || 3000,
    cors: process.env.CORS || '*',
    ttl: 15 * 3600 * 24 * 1000
});
