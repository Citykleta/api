"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const capitalizeFirstLetter = (string) => {
    const [first, ...rest] = string;
    return first.toUpperCase() + rest.join('');
};
const convertCase = string => string.split('-')
    .map(capitalizeFirstLetter)
    .join('');
const excludeFiles = ['index.js', 'types.js'];
const extension = {
    priority: 1000,
    extension: sh => {
        const files = fs_1.readdirSync('./src/db/models')
            .filter(f => !excludeFiles.includes(f) && !f.endsWith('.ts'))
            .map(f => f.split('.'));
        for (const [name, ext] of files) {
            const factory = require(`../models/${name}.${ext}`).default;
            const modelName = convertCase([...name]
                .map((l, i) => i === 0 ? l.toUpperCase() : l)
                .join(''));
            sh.model(modelName, factory);
        }
        return sh;
    }
};
exports.default = extension;
