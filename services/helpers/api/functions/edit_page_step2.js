const { Page } = require('../../../database/models');

module.exports = edit_page_step2 = async (body) => {

    const { client, id, name, slug, allowed_from, description, status } = body.data;

    const existingPageSlug = await Page.query()
        .where('slug', slug)
        .whereNot('id', id)
        .first();
        
    if(existingPageSlug) {
        return {
            status: 200,
            outcome: 'KO',
            message: 'The specified page slug already exists.'
        };
    }

    const page = await Page.query()
        .where('id', id)
        .update({
            name,
            slug,
            allowed_from: allowed_from ? allowed_from : null,
            description,
            status,
            client_id: client
        });

    if(!page) {
        return {
            status: 200,
            outcome: 'KO',
            message: 'An error occurred while updating the page.'
        };
    }

    return {
        status: 200,
        outcome: 'OK',
        data: body.data
    };
}
