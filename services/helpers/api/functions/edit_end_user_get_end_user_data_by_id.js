const { EndUser, EndUserAddress, EndUserPhoneNumber } = require('../../../database/models');

module.exports = edit_end_user_get_end_user_data_by_id = async (body) => {
    const { data } = body;
        
    const endUserId = data[`bo.end_users.id`];

    const endUser = await EndUser.query()
        .findById(endUserId);

    if(!endUser) {
        return {
            status: 200,
            outcome: 'KO',
            message: `The specified user doesn't exist`
        };
    }

    const endUserAddress = await EndUserAddress.query()
        .where('user_id', endUserId)
        .first();

    if(!endUserAddress) {
        return {
            status: 200,
            outcome: 'KO',
            message: `The specified user's address doesn't exist`
        };
    }

    const endUserPhoneNumbers = await EndUserPhoneNumber.query()
        .where('user_id', endUserId);

    if(!endUserPhoneNumbers) {
        return {
            status: 200,
            outcome: 'KO',
            message: `The specified user's phone numbers don't exist`
        };
    }

    return {
        status: 200,
        outcome: 'OK',
        data: {
            id: endUserId,
            name: endUser.name,
            surname: endUser.surname,
            email: endUser.email,
            phone_numbers: endUserPhoneNumbers.map( (endUserPhoneNumber, index) => ({ key: index, label: endUserPhoneNumber.phone_number, value: endUserPhoneNumber.phone_number }) ),
            pod: endUser.pod,
            cf: endUser.cf,
            moa: endUser.moa,
            address: endUserAddress.address,
            city: endUserAddress.city,
            postal_code: endUserAddress.postal_code,
            country: endUserAddress.country
        }
    };

}