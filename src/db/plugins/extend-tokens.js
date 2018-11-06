"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const extension = {
    priority: 500,
    extension: sh => {
        const Tokens = sh.model('Tokens');
        Tokens.revoke = function (userId, applicationId) {
            return Tokens
                .update()
                .set('revoked', true)
                .where('user_id', '$userId')
                .and('application_id', '$applicationId')
                .run({ userId, applicationId });
        };
        return sh;
    }
};
exports.default = extension;
