const { Role } = require('../../../database/models');

module.exports = user_details_step2 = async (body) => {
    const { roles: dataRoles, client } = body.data;
    const rawRoles = dataRoles.map( role => role.value );
    const roles = await Role.query()
        .whereIn('id', rawRoles);

    if(roles.length > 0) {
        return {
            status: 200,
            outcome: 'OK',
            data: {
                roles: roles.map( (role, index) => ({ key: index, label: role.name, value: role.id }) ),
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
