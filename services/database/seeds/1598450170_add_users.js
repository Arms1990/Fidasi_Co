const argon2 = require('argon2');

const { User, OAuthClient } = require('../models');

exports.seed = async function(knex) {
  const backOfficeClient = await OAuthClient.query()
    .findById(1);
  const frontOfficeClient = await OAuthClient.query()
    .findById(2);

  const twoMonthsBack = new Date();
  twoMonthsBack.setMonth(twoMonthsBack.getMonth() - 2);
  twoMonthsBack.setHours(0, 0, 0);
  twoMonthsBack.setMilliseconds(0);

  return await User.query()
    .insert([
      {
        first_name: 'Renato',
        last_name: 'Ricci',
        user_id: 'r.ricci',
        password: await argon2.hash('renx123'),
        email_address: 'r.ricci@leveln.it',
        phone_number: '+393398807840',
        status: 'A',
        user_created: new Date(),
        client_id: backOfficeClient.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        first_name: 'Tania',
        last_name: 'Tan',
        user_id: 'tania',
        password: await argon2.hash('taniax'),
        email_address: 'tania.cito@fidasi.it',
        phone_number: '+393381234567',
        status: 'A',
        user_created: new Date(),
        client_id: backOfficeClient.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        first_name: 'Jane',
        last_name: 'Doe',
        user_id: 'jane',
        password: await argon2.hash('secret'),
        email_address: 'jane@doe.com',
        status: 'A',
        user_created: new Date(),
        client_id: frontOfficeClient.id,
        created_at: twoMonthsBack,
        updated_at: twoMonthsBack
      },
      {
        first_name: 'Bruce',
        last_name: 'Wayne',
        user_id: 'bruce',
        password: await argon2.hash('brucex'),
        email_address: 'bruce.wayne@wayneenterprises.com',
        phone_number: '+393381234567',
        status: 'A',
        user_created: new Date(),
        client_id: backOfficeClient.id,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
};