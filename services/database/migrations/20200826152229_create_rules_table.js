const { ruleStatuses, findKeyByValue } = require('../enums');

exports.up = async function(knex) {
    const existence = await knex.schema
        .withSchema('bo')
        .hasTable('rules');

    if(!existence) {
        return knex.schema
            .withSchema('bo')
            .createTable('rules', function(table) {
                table.increments('id');
                table.string('name').notNullable();
                table.string('procedure').notNullable();
                table.string('priority').notNullable();
                table.string('error_code').notNullable();
                table.string('error_message').notNullable();
                table.enu('status', Object.keys(ruleStatuses)).defaultTo(findKeyByValue(ruleStatuses, 'N')).notNullable();
                table.integer('client_id').unsigned().notNullable();
                table.foreign('client_id').references('id').inTable('bo' + '.oauth_clients');
                table.timestamps(false, true);
            });
    }
};

exports.down = async function(knex) {
  
    const existence = await knex.schema
        .withSchema('bo')
        .hasTable('rules');

    if(existence) {
        return knex.schema
            .withSchema('bo')
            .dropTable('rules');
    }
};
