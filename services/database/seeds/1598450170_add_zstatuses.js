const { Status } = require('../models');

exports.seed = async function(knex) {

  return await Status.query()
    .insert([
      {
        status: 'Not Contacted'
      },
      {
        status: 'Message Sent'
      },
      {
        status: 'Completed'
      }
    ]);
};
