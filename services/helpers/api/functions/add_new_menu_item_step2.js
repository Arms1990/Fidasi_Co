const { Role } = require('../../../database/models');

module.exports = add_new_menu_item_step2 = async (body) => {
    const { roles: rawRoles, client } = body.data;
    const roles = await Role.query()
        .findById(rawRoles);

    if(roles) {
        return {
            status: 200,
            outcome: 'OK',
            data: {
                roles: rawRoles,
                client
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
