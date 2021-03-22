
exports.up = async function(knex) {
    
    const existence = await knex.schema
        .withSchema('bo')
        .hasTable('oauth_authorization_codes');

    if(!existence) {
        return knex.schema
            .withSchema('bo')
            .createTable('oauth_authorization_codes', function(table) {
                table.increments('id');
                table.string('authorization_code').notNullable();
                table.string('expires').notNullable();
                table.string('redirect_uris').notNullable();
                table.string('scope').notNullable();
                table.integer('client_id').unsigned().notNullable();
                table.foreign('client_id').references('id').inTable('bo' + '.oauth_clients');
                table.integer('user_id').unsigned().notNullable();
                table.foreign('user_id').references('id').inTable('bo' + '.users');
                table.timestamps(false, true);
            });
    }


};

exports.down = async function(knex) {
    const existence = await knex.schema
        .withSchema('bo')
        .hasTable('oauth_authorization_codes');

    if(existence) {
        return knex.schema
            .withSchema('bo')
            .dropTable('oauth_authorization_codes');
    }
};
