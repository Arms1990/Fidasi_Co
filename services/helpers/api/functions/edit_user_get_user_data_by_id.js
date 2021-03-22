const { User } = require('../../../database/models');

module.exports = edit_user_get_user_data_by_id = async (body) => {
    const { data } = body;
    
    const userId = data[`bo.users.id`];

    const user = await User.query()
        .findById(userId)
        .withGraphFetched('roles(selectRole)')
        .modifiers({
            selectRole(builder) {
                builder.select('roles.id', 'roles.name')
            }
        });

    if(!user) {
        return {
            status: 200,
            outcome: 'KO',
            message: `The specified user doesn't exist`
        };
    }

    return {
        status: 200,
        outcome: 'OK',
        data: {
            id: userId,
            client: user.client_id,
            roles: user.roles.map( (role, index) => ({ key: index, label: role.name, value: role.id }) )
        }
    };

}