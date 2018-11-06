"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const extension = {
    priority: 100,
    extension: sh => {
        for (const [name, model] of sh) {
            const select = model.select.bind(model);
            model.select = (...args) => {
                const builder = select(...args);
                const originalInclude = builder.include.bind(builder);
                return Object.assign(builder, {
                    debug(vals) {
                        console.log(this.build(vals));
                        return this.run(vals);
                    },
                    include(...args) {
                        return Object.assign(originalInclude(...args), {
                            debug(vals) {
                                console.log(this.build(vals));
                                return this.run(vals);
                            }
                        });
                    }
                });
            };
        }
        return sh;
    }
};
exports.default = extension;
