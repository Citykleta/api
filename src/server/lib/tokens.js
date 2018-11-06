"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
exports.issue = (scope = {}) => ({
    value: crypto_1.randomBytes(16).toString('hex'),
    scope
});
