
exports.seed = async function(knex) {
    return await knex.withSchema('bo')
      .from('contract_type')
      //.del()
      .insert([
        {
          name: 'Enel',
          description: 'Enel.'
        },
        {
          name: 'Iberderola',
          description: 'Iberderola.'
        },
        {
          name: 'Vodaphone',
          description: 'Vodaphone.'
        },
        {
          name: 'Iren',
          description: 'Iren.'
        }
      ]);
  };
  