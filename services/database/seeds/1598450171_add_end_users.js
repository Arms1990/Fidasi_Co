const { EndUser, Status } = require('../models');

exports.seed = async function(knex) {

  return await EndUser.query()
    .insert([
      {
        name: 'Armando',
        surname: 'Cito',
        email: 'armandocito@gmail.com',
        cf: '31234532423',
        status: 1,
        user_id_insert: 1
      },
      {
        name: 'Renato',
        surname: 'Ricci',
        email: 'r.ricci@leveln.it',
        cf: '78687686',
        status: 2,
        user_id_insert: 2
      }
    ]);
};
