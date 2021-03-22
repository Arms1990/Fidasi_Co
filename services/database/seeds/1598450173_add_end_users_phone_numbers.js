const { EndUserPhoneNumber } = require('../models');

exports.seed = async function(knex) {

  return await EndUserPhoneNumber.query()
    .insert([
      {
        phone_number: '+393292978305',
        user_id: 1
      },
      {
        phone_number: '+393398807840',
        user_id: 2
      }
    ]);
};
