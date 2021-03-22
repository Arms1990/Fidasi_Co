exports.seed = async function (knex) {

  const backOfficeClient = await knex
    .withSchema('bo')
    .from("oauth_clients")
    .where('client_id', 1)
    .first();

  const administratorRole = await knex
    .withSchema('bo')
    .from("roles")
    .where("name", "administrator")
    .first();
  const frontOfficeRole = await knex
    .withSchema('bo')
    .from("roles")
    .where("name", "front-officer")
    .first();

  return await knex
    .withSchema('bo')
    .from("oauth_client_roles")
    .del()
    .insert([
      {
        role_id: administratorRole.id,
        client_id: backOfficeClient.id,
      },
      {
        role_id: frontOfficeRole.id,
        client_id: backOfficeClient.id,
      },
    ]);
};
