const { pageDetailStatuses, findKeyByValue } = require('../enums');

exports.up = async function(knex) {
    const existence = await knex.schema
        .withSchema('bo')
        .hasTable('page_details');

    if(!existence) {
        return knex.schema
            .withSchema('bo')
            .createTable('page_details', function(table) {
                table.increments('id');
                // table.string('name').notNullable();
                // table.string('procedure').notNullable();
                table.string('function').notNullable();
                table.json('details');
                table.enu('status', Object.keys(pageDetailStatuses)).defaultTo(findKeyByValue(pageDetailStatuses, 'N')).notNullable();
                table.integer('page_id').unsigned().notNullable();
                table.foreign('page_id').references('id').inTable('bo' + '.pages');
                table.integer('role_id').unsigned().notNullable();
                table.foreign('role_id').references('id').inTable('bo' + '.roles');
                table.timestamps(false, true);
            });
    }
};

exports.down = async function(knex) {
  
    const existence = await knex.schema
        .withSchema('bo')
        .hasTable('page_details');

    if(existence) {
        return knex.schema
            .withSchema('bo')
            .dropTable('page_details');
    }
};
