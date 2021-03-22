const { Role } = require('../../../database/models');

module.exports = add_new_page_detail_step1 = async (body) => {
    const { role: rawRole, page } = body.data;
    const role = await Role.query()
        .findById(rawRole);

    if(role) {
        return {
            status: 200,
            outcome: 'OK',
            data: {
                role: role.id,
                page
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
