const argon2 = require('argon2');
const { User, UserRole } = require('../../../database/models');

module.exports = user_details_step3 = async (body) => {

    const { data } = body;

    const userIdCheck = await User.query()
        .where('user_id', data.user_id)
        .first();
    
    if(userIdCheck) {
        return {
            status: 200,
            outcome: 'KO',
            message: 'The specified user ID already exists.'
        };
    }

    const userEmailCheck = await User.query()
        .where('email_address', data.email)
        .first();
    
    if(userEmailCheck) {
        return {
            status: 200,
            outcome: 'KO',
            message: 'The specified e-mail address already exists.'
        };
    }

    const user = await User.query()
        .insert({
            first_name: data.first_name,
            last_name: data.last_name,
            email_address: data.email,
            user_id: data.user_id,
            password: await argon2.hash('secret'),
            company: data.company,
            bio: data.bio,
            status: data.status,
            client_id: data.client
        });

    if(!user) {
        return {
            status: 200,
            outcome: 'KO',
            message: 'An error occurred while creating the user.'
        };
    }

    if(data.roles.length > 0) {
        const userRoles = await UserRole.query()
            .insert( data.roles.map( role => ({
                user_id: user.id,
                role_id: role.value
            })));
        if(!userRoles) {
            return {
                status: 200,
                outcome: 'KO',
                message: 'An error occurred while saving roles for the user.'
            };
        }
    }

    return {
        status: 200,
        outcome: 'OK',
        data
    };
}