const { EndUser, Status, EndUserPhoneNumber } = require('../../../database/models');

module.exports = get_end_user_details = async (body) => {
    const { data } = body;
    const endUserId = data['bo.end_users.id'];

    // const endUser = await EndUser.query()
    //     .findById(endUserId);

    // const messageSentStatus = await Status.query()
    //     .where('status', 'Message Sent')
    //     .first();

/*    if(endUser && (messageSentStatus && endUser.status === messageSentStatus.id)) {
        return {
            status: 400,
            outcome: 'KO',
            message: `hai già inviato l'SMS per questo utente.`
        };
    }
*/
    let endUserPhoneNumbers = await EndUserPhoneNumber.query()
        .where('user_id', endUserId);
    endUserPhoneNumbers = endUserPhoneNumbers.map( (endUserPhoneNumber, index) => ({ key: index, value: endUserPhoneNumber.phone_number, label: endUserPhoneNumber.phone_number }) );
    return {
        status: 200,
        outcome: 'OK',
        data: {
            user_id: endUserId,
            endUserPhoneNumbers
        }
    };
};
