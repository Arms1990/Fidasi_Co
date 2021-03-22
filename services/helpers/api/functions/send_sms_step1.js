const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const { EndUser, OAuthEndUserAccessToken, Status } = require('../../../database/models');

const randomBytes = require('bluebird').promisify(require('crypto').randomBytes);

module.exports = send_sms_step1 = async (body) => {

    try {

        const { data } = body;

        const token = Math.random().toString(36).substring(9); //await randomBytes(9);
        const tokenExpires = new Date();
        tokenExpires.setMinutes(tokenExpires.getMinutes() + 10);
        
        await OAuthEndUserAccessToken.query()
            .insert({
                token,
                expires: tokenExpires,
                active: true,
                activated_at: new Date(),
                user_id: data.user_id
            });

        const phoneNumbers = data.endUserPhoneNumbers.map( endUserPhoneNumber => endUserPhoneNumber.value );
    
        const phoneNumbersMapped = phoneNumbers.map( async (phoneNumber) => {
    
            const message = await client.messages
                .create({
                    body: `
                    Fidasi - questo è il link: http://backoffice.fidasi.it/consenso/?id=${token}
                    `,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: phoneNumber
                });
    
            return message;
    
    
        });
    
        await Promise.all(phoneNumbersMapped);
    
        const messageSentStatus = await Status.query()
            .where('status', 'Message Sent')
            .first();
    
        await EndUser.query()
            .where('id', data.user_id)
            .update({
                status: messageSentStatus.id || 1
            });
        
    
        return {
            status: 200,
            outcome: 'OK',
            data
        };
    } catch(e) {
        return {
            status: 500,
            outcome: 'KO',
            message: e.message || `An error occurred while sending SMS.`
        };
    }


}
