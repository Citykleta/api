"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const extension = {
    priority: 100,
    extension: sh => {
        for (const [name, model] of sh) {
            const select = model.select.bind(model);
            const { definition } = model;
            const { searchable = [] } = definition;
            model.select = (...args) => {
                const builder = select(...args);
                const originalInclude = builder.include.bind(builder);
                const searchableBuilder = builder => {
                    builder.search = function (input) {
                        if (input && searchable.length) {
                            const [first, ...rest] = searchable;
                            return rest.reduce((acc, current) => acc.or(current, '~~*', '$search'), builder.where(first, 'ILIKE', `$search`))
                                .noop();
                        }
                        return this;
                    };
                    return builder;
                };
                return searchableBuilder(Object.assign(builder, {
                    include(...args) {
                        return searchableBuilder(originalInclude(...args));
                    }
                }));
            };
        }
        return sh;
    }
};
exports.default = extension;
