const { OAuthClient } = require('../../../database/models');

module.exports = edit_user_step1 = async (body) => {

    const { client, roles, id } = body.data;

    const oauth_client = await OAuthClient.query()
        .findById(client);

    if(!oauth_client) {
        return {
            status: 200,
            outcome: 'KO',
            message: 'No such client exists.'
        };
    }

    return {
        status: 200,
        outcome: 'OK',
        data: {
            client,
            roles,
            id
        }
    };
}