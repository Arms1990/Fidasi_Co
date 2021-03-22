const { Page } = require('../../../database/models');

module.exports = edit_page_get_page_data_by_id = async (body) => {
    const { data } = body;
    
    const pageId = data[`bo.pages.id`];

    const page = await Page.query()
        .findById(pageId);

    if(!page) {
        return {
            status: 200,
            outcome: 'KO',
            message: `The specified page doesn't exist`
        };
    }

    return {
        status: 200,
        outcome: 'OK',
        data: {
            id: pageId,
            client: page.client_id
        }
    };

}
