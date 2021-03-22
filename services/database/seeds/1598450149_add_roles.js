
exports.seed = async function(knex) {
  return await knex.withSchema('bo')
    .from('roles')
    .del()
    .insert([
      {
        name: 'administrator',
        description: 'Administrator can manage everything.',
        access_bo: true
      },
      {
        name: 'operator',
        description: 'Operator can manage CRM and see profile.',
        access_bo: true
      },
      {
        name: 'front-officer',
        description: 'Can view everything on front office.'
      },
      {
        name: 'agent',
        description: 'Agent can upload entries.',
        access_bo: true
      }
    ]);
};
