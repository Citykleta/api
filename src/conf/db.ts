export interface DatabaseConfiguration {
    readonly host: string;
    readonly user: string;
    readonly password: string;
    readonly port: number;
    readonly database: string;
}

export const conf: DatabaseConfiguration = Object.freeze({
    host: process.env.POSTGRES_HOST || 'localhost',
    user: process.env.POSTGRES_USER || 'docker',
    password: process.env.POSTGRES_PASSWORD || 'docker',
    port: Number(process.env.POSTGRES_PORT) || 5432,
    database: process.env.POSTGRES_DB || 'citykleta'
});
