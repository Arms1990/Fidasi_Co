
exports.up = async function(knex) {
    const existence = await knex.schema
        .withSchema('bo')
        .hasTable('user_roles');

    if(!existence) {
        return knex.schema
            .withSchema('bo')
            .createTable('user_roles', function(table) {
                table.increments('id');
                table.integer('role_id').unsigned().notNullable();
                table.foreign('role_id').references('id').inTable('bo' + '.roles');
                table.integer('user_id').unsigned().notNullable();
                table.foreign('user_id').references('id').inTable('bo' + '.users');
                table.timestamps(false, true);
            });
    }
};

exports.down = async function(knex) {
  
    const existence = await knex.schema
        .withSchema('bo')
        .hasTable('user_roles');

    if(existence) {
        return knex.schema
            .withSchema('bo')
            .dropTable('user_roles');
    }
};
