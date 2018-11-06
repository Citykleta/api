import {conf as server, ServerConfiguration} from './server';
import {conf as db, DatabaseConfiguration} from './db';

//todo we could load based on env
interface Configuration {
    readonly server: ServerConfiguration;
    readonly db: DatabaseConfiguration;
}

const conf: Configuration = {
    server,
    db
};

Object.freeze(conf);

export default conf;
