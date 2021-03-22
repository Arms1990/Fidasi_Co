const { userStatuses, findKeyByValue } = require('../enums');

exports.up = async function(knex) {
    const existence = await knex.schema
        .withSchema('bo')
        .hasTable('password_resets');

    if(!existence) {
        return knex.schema
            .withSchema('bo')
            .createTable('password_resets', function(table) {
                table.increments('id');
                table.string('code');
                table.boolean('completed').defaultsTo(false);
                table.integer('user_id').unsigned().notNullable();
                table.foreign('user_id').references('id').inTable('bo' + '.users');
                table.timestamps(false, true);
            });
    }
};

exports.down = async function(knex) {

    const existence = await knex.schema
        .withSchema('bo')
        .hasTable('password_resets');

    if(existence) {
        return knex.schema
            .withSchema('bo')
            .dropTable('password_resets');
    }
};
