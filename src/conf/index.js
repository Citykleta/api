"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const db_1 = require("./db");
const conf = {
    server: server_1.conf,
    db: db_1.conf
};
Object.freeze(conf);
exports.default = conf;
