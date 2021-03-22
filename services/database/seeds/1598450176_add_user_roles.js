
exports.seed = async function(knex) {
  const renato = await knex.withSchema('bo').from('users').where('user_id', 'r.ricci').first();
  const tania = await knex.withSchema('bo').from('users').where('user_id', 'tania').first();
  const bruce = await knex.withSchema('bo').from('users').where('user_id', 'bruce').first();

  const administratorRole = await knex.withSchema('bo').from('roles').where('name', 'administrator').first();
  const operatorRole = await knex.withSchema('bo').from('roles').where('name', 'operator').first();
  const agentRole = await knex.withSchema('bo').from('roles').where('name', 'agent').first();


  return await knex.withSchema('bo')
    .from('user_roles')
    .del()
    .insert([
      {
        role_id: administratorRole.id,
        user_id: renato.id
      },
      {
        role_id: operatorRole.id,
        user_id: tania.id
      },
      {
        role_id: agentRole.id,
        user_id: bruce.id
      }
    ]);
};
