const { Page } = require('../../../database/models');

module.exports = add_new_page_step2 = async (body) => {

    const {
        name,
        slug,
        description,
        allowed_from,
        status,
        client
    } = body.data;

    const page = await Page.query()
        .insert({
            name,
            slug,
            description,
            allowed_from: allowed_from ? allowed_from : null,
            status,
            client_id: client
        });

    if(!page) {
        return {
            status: 200,
            outcome: 'KO',
            message: 'An error occurred while creating the page.'
        };
    }

    return {
        status: 200,
        outcome: 'OK',
        data: body.data
    };

}