const { OAuthClient } = require('../../../database/models');

module.exports = add_new_page_step1 = async (body) => {

    const { client } = body.data;

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
            client
        }
    };
}
