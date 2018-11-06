export const auth = (ctx) => {
    const authorization = ctx.get('authorization');
    const [scheme, value] = authorization.split(' ');
    if (scheme.toLowerCase() !== 'bearer') {
        throw new Error('Could not recognize bearer token authenticate scheme');
    }
    return value;
};
