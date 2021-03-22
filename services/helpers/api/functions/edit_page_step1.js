const { OAuthClient, Page } = require('../../../database/models');

module.exports = edit_page_step1 = async (body) => {

    const { client, id } = body.data;

    const oauth_client = await OAuthClient.query()
        .findById(client);

    if(!oauth_client) {
        return {
            status: 200,
            outcome: 'KO',
            message: 'No such client exists.'
        };
    }

    const page = await Page.query()
        .findById(id);

    if(!page) {
        return {
            status: 200,
            outcome: 'KO',
            message: 'No such page exists.'
        };
    }

    const { name, slug, allowed_from, description, status, client_id } = page;

    return {
        status: 200,
        outcome: 'OK',
        data: {
            client,
            id,
            name,
            slug,
            allowed_from: allowed_from ? allowed_from : null,
            description,
            status,
            client: client_id
        }
    };
}

