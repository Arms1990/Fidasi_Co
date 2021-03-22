const { Status, EndUser, EndUserPhoneNumber, EndUserAddress } = require('../../../database/models');

module.exports = add_new_user_step1 = async (body) => {

    try {


        const { data } = body;

        const { name, surname, moa, email, phone_numbers: rawPhoneNumbers, pod, cf, address, city, postal_code, country } = data;

        const phoneNumbers = rawPhoneNumbers.map( rawPhoneNumber => rawPhoneNumber.value );

        const emailExistence = await EndUser.query()
            .where('email', email)
            .first();

        if(emailExistence) {
            return {
                status: 400,
                outcome: 'KO',
                message: `A user with this e-mail address already exists.`
            };
        }


        const status = await Status.query()
            .where('status', 'Not Contacted')
            .first();

        const endUser = await EndUser.query()
            .insert({
                name,
                surname,
                email,
                cf,
                pod,
                moa,
                status: status.id || 1,
                user_id_insert: body.user_id
            });

        if(!endUser) {
            return {
                status: 400,
                outcome: 'KO',
                message: `An error occurred while adding the user.`
            };
        }

        const endUserPhoneNumers = await EndUserPhoneNumber.query()
            .insert(
                phoneNumbers.map( phoneNumber => ({ user_id: endUser.id, phone_number: phoneNumber }) )
            );

        if(!endUserPhoneNumers) {
            return {
                status: 400,
                outcome: 'KO',
                message: `An error occurred while adding the user's phone numbers.`
            };
        }

        const endUserAddress = await EndUserAddress.query()
            .insert({
                address,
                city,
                postal_code,
                country,
                user_id: endUser.id
            });

        if(!endUserAddress) {
            return {
                status: 400,
                outcome: 'KO',
                message: `An error occurred while adding the user's address.`
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
            message: e.message || `An error occurred while creating user.`
        };   
    }

};