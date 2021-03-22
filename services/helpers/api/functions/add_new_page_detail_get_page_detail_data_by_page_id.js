const { Page } = require('../../../database/models');

module.exports = add_new_page_detail_get_page_detail_data_by_page_id = async (body) => {
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
            page: page.id
        }
    };

}