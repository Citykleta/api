"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const ship_hold_1 = require("ship-hold");
const conf_1 = require("../conf");
const { db } = conf_1.default;
const extensions = fs_1.readdirSync('./src/db/plugins')
    .filter(f => !f.endsWith('.ts') && f !== 'types.js')
    .map(f => require(`./plugins/${f}`).default)
    .sort(({ priority: prioA }, { priority: prioB }) => prioA === prioB ? 0 : (prioA > prioB ? -1 : 1));
const sh = ship_hold_1.default(db);
for (const { extension } of extensions) {
    extension(sh);
}
exports.default = sh;
