const { userStatuses, findKeyByValue } = require('../enums');

exports.up = async function(knex) {
    const existence = await knex.schema
        .withSchema('bo')
        .hasTable('end_users');

    if(!existence) {
        return knex.schema
            .withSchema('bo')
            .createTable('end_users', function(table) {
                table.increments('id');
                table.string('name').notNullable();
                table.string('surname').notNullable();
                table.string('email').unique().notNullable();
                table.string('cf').notNullable();
                table.string('pod');
                table.string('moa');
                table.integer('user_id_insert').unsigned();
                table.foreign('user_id_insert').references('id').inTable('bo' + '.users');
                table.integer('user_id_last_modify').unsigned();
                table.foreign('user_id_last_modify').references('id').inTable('bo' + '.users');
                table.boolean('tos_accepted').notNullable().defaultsTo(false);
                table.integer('status').unsigned();
                table.foreign('status').references('id').inTable('bo' + '.statuses');
                table.string('ip_address');
                table.timestamps(false, true);
            });
    }
};

exports.down = async function(knex) {

    const existence = await knex.schema
        .withSchema('bo')
        .hasTable('end_users');

    if(existence) {
        return knex.schema
            .withSchema('bo')
            .dropTable('end_users');
    }
};
