import {ShipholdExtension} from './types';
import {readdirSync} from 'fs'
;
const capitalizeFirstLetter = (string: string): string => {
    const [first, ...rest] = string;
    return first.toUpperCase() + rest.join('');
};

const convertCase = string => string.split('-')
    .map(capitalizeFirstLetter)
    .join('');

const excludeFiles = ['index.js','types.js'];

const extension: ShipholdExtension = {
    priority: 1000,
    extension: sh => {
        const files = readdirSync('./src/db/models')
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

export default extension;
