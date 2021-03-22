const { Role, User } = require('../../../database/models');

module.exports = edit_user_step2 = async (body) => {
    const { roles: dataRoles, client, id } = body.data;
    const rawRoles = dataRoles.map( role => role.value );
    const roles = await Role.query()
        .whereIn('id', rawRoles);

    const user = await User.query()
        .findById(id);

    if(!user) {
        return {
            status: 200,
            outcome: 'KO',
            message: `The specified user doesn't exist`
        };
    }

    if(roles.length > 0) {
        return {
            status: 200,
            outcome: 'OK',
            data: {
                roles: roles.map( (role, index) => ({ key: index, label: role.name, value: role.id }) ),
                client,
                id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email_address,
                user_id: user.user_id,
                company: user.company,
                bio: user.bio,
                status: user.status
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