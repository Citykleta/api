export interface ServerConfiguration {
    readonly port: number;
    readonly cors: string;
    readonly ttl: number;
}

export const conf: ServerConfiguration = Object.freeze({
    port: Number(process.env.SERVER_PORT) || 3000,
    cors: process.env.CORS || '*',
    ttl: 15 * 3600 * 24 * 1000
});
