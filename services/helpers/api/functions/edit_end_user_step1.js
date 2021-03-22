const { Status, EndUser, EndUserPhoneNumber, EndUserAddress } = require('../../../database/models');

module.exports = edit_end_user_step1 = async (body) => {

    try {
        const { data } = body;

        const { id, name, surname, moa, email, phone_numbers: rawPhoneNumbers, pod, cf, address, city, postal_code, country } = data;
        const phoneNumbers = rawPhoneNumbers.map( rawPhoneNumber => rawPhoneNumber.value );

        const emailExistence = await EndUser.query()
            .where('email', email)
            .whereNot('id', id)
            .first();

        if(emailExistence) {
            return {
                status: 400,
                outcome: 'KO',
                message: `A user with this e-mail address already exists.`
            };
        }

        const endUser = await EndUser.query()
            .findById(id);

        if(!endUser) {
            return {
                status: 400,
                outcome: 'KO',
                message: `The user doesn't exist`
            };
        }

        const endUserPatch = await EndUser.query()
            .patch({
                name,
                surname,
                email,
                cf,
                pod,
                moa,
                user_id_last_modify: body.user_id
            })
            .where('id', endUser.id);

        if(!endUserPatch) {
            return {
                status: 400,
                outcome: 'KO',
                message: `An error occurred while updating the user.`
            };
        }

        await EndUserPhoneNumber.query()
            .delete()
            .where('user_id', endUser.id);

        const endUserPhoneNumers = await EndUserPhoneNumber.query()
            .insert(
                phoneNumbers.map( phoneNumber => ({ user_id: endUser.id, phone_number: phoneNumber }) )
            );

        if(!endUserPhoneNumers) {
            return {
                status: 400,
                outcome: 'KO',
                message: `An error occurred while updating the user's phone numbers.`
            };
        }

        const endUserAddress = await EndUserAddress.query()
            .patch({
                address,
                city,
                postal_code,
                country
            })
            .where('user_id', endUser.id);

        if(!endUserAddress) {
            return {
                status: 400,
                outcome: 'KO',
                message: `An error occurred while updating the user's address.`
            };
        }
        
        return {
            status: 200,
            outcome: 'OK',
            data
        };

    } catch(e) {
        return {
            status: 500,
            outcome: 'KO',
            message: e.message || `An error occurred while updating user.`
        };   
    }

};