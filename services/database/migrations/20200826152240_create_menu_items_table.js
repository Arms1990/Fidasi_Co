const { menuItemStatuses, findKeyByValue } = require('../enums');

exports.up = async function(knex) {
    const existence = await knex.schema
        .withSchema('bo')
        .hasTable('menu_items');

    if(!existence) {
        return knex.schema
            .withSchema('bo')
            .createTable('menu_items', function(table) {
                table.increments('id');
                table.string('name').notNullable();
                table.string('image');
                table.integer('priority');
                table.enu('status', Object.keys(menuItemStatuses)).defaultTo(findKeyByValue(menuItemStatuses, 'N')).notNullable();
                table.integer('page_id').unsigned().notNullable();
                table.foreign('page_id').references('id').inTable('bo' + '.pages');
                table.integer('parent_id').unsigned();
                table.foreign('parent_id').references('id').inTable('bo' + '.menu_items');
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
        .hasTable('menu_items');

    if(existence) {
        return knex.schema
            .withSchema('bo')
            .dropTable('menu_items');
    }
};
