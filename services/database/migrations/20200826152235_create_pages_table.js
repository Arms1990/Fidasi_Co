const { pageStatuses, findKeyByValue } = require('../enums');

exports.up = async function(knex) {
    const existence = await knex.schema
        .withSchema('bo')
        .hasTable('pages');

    if(!existence) {
        return knex.schema
            .withSchema('bo')
            .createTable('pages', function(table) {
                table.increments('id');
                table.string('name').notNullable();
                table.string('slug').notNullable();
                table.text('description').notNullable();
                table.text('allowed_from');
                table.enu('status', Object.keys(pageStatuses)).defaultTo(findKeyByValue(pageStatuses, 'N')).notNullable();
                table.integer('client_id').unsigned().notNullable();
                table.foreign('client_id').references('id').inTable('bo' + '.oauth_clients');
                table.timestamps(false, true);
            });
    }
};

exports.down = async function(knex) {
  
    const existence = await knex.schema
        .withSchema('bo')
        .hasTable('pages');

    if(existence) {
        return knex.schema
            .withSchema('bo')
            .dropTable('pages');
    }
};
