const { userStatuses, findKeyByValue } = require('../enums');

exports.up = async function(knex) {
    const existence = await knex.schema
        .withSchema('bo')
        .hasTable('users');

    if(!existence) {
        return knex.schema
            .withSchema('bo')
            .createTable('users', function(table) {
                table.increments('id');
                table.string('first_name').notNullable();
                table.string('last_name').notNullable();
                table.string('user_id').unique().notNullable();
                table.string('email_address').unique().notNullable();
                table.string('password').notNullable();
                table.string('company');
                table.text('image');
                table.text('bio');
                table.string('phone_number');
                table.enu('status', Object.keys(userStatuses)).defaultTo(findKeyByValue(userStatuses, 'N')).notNullable();
                table.timestamp('user_created');
                table.integer('client_id').unsigned().notNullable();
                table.foreign('client_id').references('id').inTable('bo' + '.oauth_clients');
                table.boolean('tfa_status').notNullable().defaultTo(false);
                table.string('tfa_secret');
                table.timestamps(false, true);
            });
    }
};

exports.down = async function(knex) {

    const existence = await knex.schema
        .withSchema('bo')
        .hasTable('users');

    if(existence) {
        return knex.schema
            .withSchema('bo')
            .dropTable('users');
    }
};
