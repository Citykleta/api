import {readdirSync} from 'fs';
import shiphold from 'ship-hold';
import conf from '../conf';
import {ShipholdExtension} from './plugins/types';

const {db} = conf;

const extensions: ShipholdExtension[] = readdirSync('./src/db/plugins')
    .filter(f => !f.endsWith('.ts') && f !== 'types.js')
    .map(f => require(`./plugins/${f}`).default)
    .sort(({priority: prioA}, {priority: prioB}) => prioA === prioB ? 0 : (prioA > prioB ? -1 : 1));

const sh = shiphold(db);

for (const {extension} of extensions) {
    extension(sh);
}

export default sh;
