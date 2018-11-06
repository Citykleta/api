import {ShipholdExtension} from './types';

const extension: ShipholdExtension = {
    priority: 500,
    extension: sh => {
        const Tokens = sh.model('Tokens');

        Tokens.revoke = function (userId: number, applicationId: string) {
            return Tokens
                .update()
                .set('revoked', true)
                .where('user_id', '$userId')
                .and('application_id', '$applicationId')
                .run({userId, applicationId});
        };

        return sh;
    }
};

export default extension;
