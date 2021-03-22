
exports.up = async function(knex) {
    const existence = await knex.schema
        .withSchema('bo')
        .hasTable('oauth_end_user_access_tokens');

    if(!existence) {
        return knex.schema
            .withSchema('bo')
            .createTable('oauth_end_user_access_tokens', function(table) {
                table.increments('id');
                table.text('token');
                table.timestamp('expires');
                table.boolean('active').default(false).notNullable();
                table.timestamp('activated_at');
                table.integer('user_id').unsigned().notNullable();
                table.foreign('user_id').references('id').inTable('bo' + '.end_users');
                table.timestamps(false, true);
            });
    }
};

exports.down = async function(knex) {
  
    const existence = await knex.schema
        .withSchema('bo')
        .hasTable('oauth_end_user_access_tokens');

    if(existence) {
        return knex.schema
            .withSchema('bo')
            .dropTable('oauth_end_user_access_tokens');
    }
};
