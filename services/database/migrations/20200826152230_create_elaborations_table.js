const { elaborationTypes, findKeyByValue } = require('../enums');

exports.up = async function(knex) {
    const existence = await knex.schema
        .withSchema('bo')
        .hasTable('elaborations');

    if(!existence) {
        return knex.schema
            .withSchema('bo')
            .createTable('elaborations', function(table) {
                table.increments('id');
                table.string('procedure').notNullable();
                table.timestamp('start').notNullable();
                table.timestamp('end');
                table.integer('return_code').unsigned();
                table.text('message');
                table.enu('state', Object.keys(elaborationTypes)).defaultTo(findKeyByValue(elaborationTypes, elaborationTypes.N)).notNullable();
                table.integer('parent_id').unsigned();
                table.foreign('parent_id').references('id').inTable('bo' + '.elaborations');
                table.timestamps(false, true);
            });
    }
};

exports.down = async function(knex) {
  
    const existence = await knex.schema
        .withSchema('bo')
        .hasTable('elaborations');

    if(existence) {
        return knex.schema
            .withSchema('bo')
            .dropTable('elaborations');
    }
};
