const { userStatuses, findKeyByValue } = require('../enums');

exports.up = async function(knex) {
    const existence = await knex.schema
        .withSchema('bo')
        .hasTable('notifications');

    if(!existence) {
        return knex.schema
            .withSchema('bo')
            .createTable('notifications', function(table) {
                table.increments('id');
                table.string('client_id').notNullable();
                table.string('notifiable_id').notNullable();
                table.string('notifiable_type').notNullable();
                table.string('type').notNullable();
                table.string('visualize');
                table.timestamp('data_creation');
                table.timestamp('data_visualitione');
                table.text('message');
                table.string('action');
                table.text('image');
                table.string('seen').notNullable().defaultsTo('N');
                table.integer('user_created').unsigned().notNullable();
                table.foreign('user_created').references('id').inTable('bo' + '.users');
                table.timestamps(false, true);
            });
    }
};

exports.down = async function(knex) {

    const existence = await knex.schema
        .withSchema('bo')
        .hasTable('notifications');

    if(existence) {
        return knex.schema
            .withSchema('bo')
            .dropTable('notifications');
    }
};
