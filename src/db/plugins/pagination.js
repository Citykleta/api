"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const page = function (number = 1, size = 20) {
    return this.limit(size, (number - 1) * size);
};
const extension = {
    priority: 100,
    extension: sh => {
        for (const [name, model] of sh) {
            const select = model.select.bind(model);
            model.select = (...args) => {
                const selectBuilder = select(...args);
                const originalInclude = selectBuilder.include.bind(selectBuilder);
                return Object.assign(selectBuilder, {
                    page,
                    include(...args) {
                        return Object.assign(originalInclude(...args), {
                            page
                        });
                    }
                });
            };
        }
        return sh;
    }
};
exports.default = extension;
