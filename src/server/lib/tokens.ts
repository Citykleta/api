import {randomBytes} from 'crypto';

export const issue = (scope = {}) => ({
    value: randomBytes(16).toString('hex'),
    scope
});
