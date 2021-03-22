// const {
//   clientID,
//   clientSecret,
//   redirectURI,
// } = require("../../oidc-service/config");

exports.seed = async function (knex) {
  return await knex
    .withSchema('bo')
    .from("oauth_clients")
    .del()
    .insert([
      {
        name: "Fidasi Back Office",
        client_id: 1,
        client_secret: 123,
        grant_types: "password,authorization_code",
        redirect_uris: `http://localhost:3000`,
      },
      {
        name: "Fidasi Front Office",
        client_id: 2,
        client_secret: 456,
        grant_types: "password,authorization_code",
        redirect_uris: `http://localhost:3000`,
      }
    ]);
};
