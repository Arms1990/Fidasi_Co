
exports.up = async function(knex) {
    const existence = await knex.schema
        .withSchema('bo')
        .hasTable('oauth_refresh_tokens');

    if(!existence) {
        return knex.schema
            .withSchema('bo')
            .createTable('oauth_refresh_tokens', function(table) {
                table.increments('id');
                table.string('refresh_token');
                table.timestamp('expires');
                table.boolean('active').default(true).notNullable();
                table.integer('client_id').unsigned().notNullable();
                table.foreign('client_id').references('id').inTable('bo' + '.oauth_clients');
                table.integer('user_id').unsigned().notNullable();
                table.foreign('user_id').references('id').inTable('bo' + '.users');
                table.integer('access_token_id').unsigned().notNullable();
                table.string('scope');
                table.timestamps(false, true);
            });
    }
};

exports.down = async function(knex) {
  
    const existence = await knex.schema
        .withSchema('bo')
        .hasTable('oauth_refresh_tokens');

    if(existence) {
        return knex.schema
            .withSchema('bo')
            .dropTable('oauth_refresh_tokens');
    }
};
