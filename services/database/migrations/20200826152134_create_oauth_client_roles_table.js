
exports.up = async function(knex) {

    const existence = await knex.schema
        .withSchema('bo')
        .hasTable('oauth_client_roles');

    if(!existence) {
        return knex.schema
            .withSchema('bo')
            .createTable('oauth_client_roles', function(table) {
                table.increments('id');
                table.integer('role_id').unsigned().notNullable();
                table.foreign('role_id').references('id').inTable('bo' + '.roles');
                table.integer('client_id').unsigned().notNullable();
                table.foreign('client_id').references('id').inTable('bo' + '.oauth_clients');
                table.timestamps(false, true);
            });
    }
};

exports.down = async function(knex) {

    const existence = await knex.schema
        .withSchema('bo')
        .hasTable('oauth_client_roles');

    if(existence) {
        return knex.schema
            .withSchema('bo')
            .dropTable('oauth_client_roles');
    }
};
