const { PageDetail } = require('../../../database/models');

module.exports = edit_page_detail_get_page_detail_data_by_page_detail_id = async (body) => {
    const { data } = body;
    
    const pageDetailId = data[`bo.page_details.id`];

    const pageDetail = await PageDetail.query()
        .findById(pageDetailId);

    if(!pageDetail) {
        return {
            status: 200,
            outcome: 'KO',
            message: `The specified page detail doesn't exist`
        };
    }

    return {
        status: 200,
        outcome: 'OK',
        data: {
            id: pageDetail.id,
            page: pageDetail.page_id,
            role: pageDetail.role_id
        }
    };

}