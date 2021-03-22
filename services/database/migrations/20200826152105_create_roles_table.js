
exports.up = async function(knex) {
    const existence = await knex.schema
        .withSchema('bo')
        .hasTable('roles');

    if(!existence) {
        return knex.schema
            .withSchema('bo')
            .createTable('roles', function(table) {
                table.increments('id');
                table.string('name').notNullable();
                table.text('description').notNullable();
                table.boolean('access_bo').defaultTo(false);
                table.timestamps(false, true);
            });
    }

};

exports.down = async function(knex) {
    const existence = await knex.schema
        .withSchema('bo')
        .hasTable('roles');

    if(existence) {
        return knex.schema
            .withSchema('bo')
            .dropTable('roles');
    }
};
