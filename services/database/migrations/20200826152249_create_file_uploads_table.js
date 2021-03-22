const { pageDetailStatuses, findKeyByValue } = require('../enums');

exports.up = async function(knex) {
    const existence = await knex.schema
        .withSchema('public')
        .hasTable('file_uploads');

    if(!existence) {
        return knex.schema
            .withSchema('public')
            .createTable('file_uploads', function(table) {
                table.increments('id');
                table.string('file_name').notNullable();
                table.string('return_code');
                table.string('msg_error');
                table.string('path').notNullable();
                table.string('status').defaultTo('N').notNullable();
                table.integer('user_id').unsigned().notNullable();
                table.string('type_contract');
                table.foreign('user_id').references('id').inTable('bo' + '.users');
                table.timestamps(false, true);
            });
    }
};

exports.down = async function(knex) {
  
    const existence = await knex.schema
        .withSchema('public')
        .hasTable('file_uploads');

    if(existence) {
        return knex.schema
            .withSchema('public')
            .dropTable('file_uploads');
    }
};
