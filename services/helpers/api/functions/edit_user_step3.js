const { UserRole, User } = require('../../../database/models');

module.exports = edit_user_step3 = async (body) => {

    const { roles, client, id, first_name, last_name, email, user_id, company, bio, status } = body.data;
    const { user_id: authenticatedUserId } = body;

    const authenticatedUser = await User.query()
        .findById(authenticatedUserId);

    const existingUser = await User.query()
        .findById(id);

    if(!existingUser) {
        return {
            status: 200,
            outcome: 'KO',
            message: `The specified user wasn't found.`
        }; 
    }
    
    if(!authenticatedUser) {
        return {
            status: 200,
            outcome: 'KO',
            message: 'Internal Server Error! Authenticated user not found.'
        }; 
    }

    if(existingUser.user_id !== user_id) {
        const userIdCheck = await User.query()
            .where('user_id', user_id)
            .first();
        
        if(userIdCheck) {
            return {
                status: 200,
                outcome: 'KO',
                message: 'The specified user ID already exists.'
            };
        }
    }

   
    if(existingUser.email_address !== email) {
        const userEmailCheck = await User.query()
            .where('email_address', email)
            .first();
        
        if(userEmailCheck) {
            return {
                status: 200,
                outcome: 'KO',
                message: 'The specified e-mail address already exists.'
            };
        }
    }
  

    const user = await User.query()
        .where('id', id)
        .update({
            first_name,
            last_name,
            email_address: email,
            user_id,
            company,
            bio,
            status,
            client_id: client
        });

    if(!user) {
        return {
            status: 200,
            outcome: 'KO',
            message: 'An error occurred while updating the user.'
        };
    }

    if(roles.length > 0) {

        await UserRole.query()
            .where('user_id', id)
            .del();

        const userRoles = await UserRole.query()
            .insert( roles.map( role => ({ user_id: id, role_id: role.value }) ) )

        if(!userRoles) {
            return {
                status: 200,
                outcome: 'KO',
                message: 'An error occurred while updating roles for the user.'
            };
        }
    }

    return {
        status: 200,
        outcome: 'OK',
        data: body.data
    };
}
