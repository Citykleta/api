// todo could be as a trigger directly in the database
import {ShipholdExtension} from './types';

const extension: ShipholdExtension = {
    priority: 100,
    extension: sh => {
        for (const [name, model] of sh) {
            const update = model.update.bind(model);
            model.update = (map = {}) => {
                const updated_at = new Date();
                return update(Object.assign({updated_at}, map));
            };
        }
        return sh;
    }
};

export default extension;
