const { EndUserAddress } = require('../models');

exports.seed = async function(knex) {

  return await EndUserAddress.query()
    .insert([
      {
        address: 'VIALE EUROPA 22',
        city: 'ROMA',
        postal_code: '00144',
        country: 'IT',
        user_id: 1
      },
      {
        address: 'VIA APPIA NUOVA 123/4',
        city: 'ROMA',
        postal_code: '00184',
        country: 'IT',
        user_id: 2
      }
    ]);
};
