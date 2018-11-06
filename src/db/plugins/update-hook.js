"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const extension = {
    priority: 100,
    extension: sh => {
        for (const [name, model] of sh) {
            const update = model.update.bind(model);
            model.update = (map = {}) => {
                const updated_at = new Date();
                return update(Object.assign({ updated_at }, map));
            };
        }
        return sh;
    }
};
exports.default = extension;
