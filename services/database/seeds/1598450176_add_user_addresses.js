
exports.seed = async function(knex) {
  const user = await knex.withSchema('bo').from('users').first();
  const administratorRole = await knex.withSchema('bo').from('roles').where('name', 'administrator').first();
  return await knex.withSchema('bo')
    .from('addresses')
    .del()
    .insert({
      address: '711-2880 Nulla St. Mankato',
      city: 'Mississippi',
      post_code: '96522',
      country: 'US',
      user_id: user.id
    });
};
