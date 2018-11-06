export const parameterize = (obj: Object) => {
    const output = {};
    for (const key of Object.keys(obj)) {
        output[key] = `$${key}`;
    }
    return output;
};

export const ifFound = (middleware: Function) => async (ctx, next) => {
    const result = await middleware(ctx, next);
    if(result !== undefined){
        ctx.body = result;
    }
};
