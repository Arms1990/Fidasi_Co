const { PageDetail } = require('../../../database/models');

module.exports = edit_page_detail_step2 = async (body) => {
    const { page, role, id, function: functionName, details, status } = body.data;


    const pageDetail = await PageDetail.query()
        .where('id', id)
        .update({
            function: functionName,
            details,
            status,
            page_id: page,
            role_id: role
        });

    if(!pageDetail) {
        return {
            status: 200,
            outcome: 'KO',
            message: 'An error occurred while updating the page details.'
        };
    }

    return {
        status: 200,
        outcome: 'OK',
        data: body.data
    };

}