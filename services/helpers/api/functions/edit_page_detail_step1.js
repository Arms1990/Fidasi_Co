const { PageDetail, Role } = require('../../../database/models');

module.exports = edit_page_detail_step1 = async (body) => {
    const { page, role: rawRole, id } = body.data;

    const role = await Role.query()
        .findById(rawRole);

    const pageDetail = await PageDetail.query()
        .findById(id);

    if(role) {
        return {
            status: 200,
            outcome: 'OK',
            data: {
                role: role.id,
                page,
                id,
                function: pageDetail.function,
                details: JSON.stringify(pageDetail.details, null, 4),
                status: pageDetail.status
            }
        };
    } else {
        return {
            status: 200,
            outcome: 'KO',
            message: 'No such role exists.'
        };
    }
}