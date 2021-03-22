
exports.up = async function(knex) {
    const existence = await knex.schema
        .withSchema('bo')
        .hasTable('oauth_clients');

    if(!existence) {
        return knex.schema
            .withSchema('bo')
            .createTable('oauth_clients', function(table) {
                table.increments('id');
                table.string('name').notNullable();
                table.string('client_id');
                table.string('client_secret').notNullable();
                table.integer('user_id').unsigned();
                table.string('redirect_uris');
                table.string('grant_types').notNullable();
                table.timestamps(false, true);
            });
    }

};

exports.down = async function(knex) {
    const existence = await knex.schema
        .withSchema('bo')
        .hasTable('oauth_clients');

    if(existence) {
        return knex.schema
            .withSchema('bo')
            .dropTable('oauth_clients');
    }
};
