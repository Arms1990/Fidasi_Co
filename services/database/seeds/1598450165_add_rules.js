
exports.seed = async function(knex) {
  const oauth_client = await knex.withSchema('bo').from('oauth_clients').first();
  return await knex.withSchema('bo')
    .from('rules')
    .del()
    .insert([
      {
        name: 'login',
        procedure: 'validateUserScopes',
        priority: 1,
        error_code: 100,
        error_message: 'There is not any scope associated with this user.',
        status: 'A',
        client_id: oauth_client.id
      },
      {
        name: 'login',
        procedure: 'validateUserStatus',
        priority: 2,
        error_code: 101,
        error_message: 'The user account is not activated.',
        status: 'A',
        client_id: oauth_client.id
      }
    ]);
};
