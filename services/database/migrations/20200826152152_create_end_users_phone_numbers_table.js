const countries = require('../../helpers/countries.json');
const countriesMapped = countries.map( country => country.alpha2Code );

exports.up = async function(knex) {
    const existence = await knex.schema
        .withSchema('bo')
        .hasTable('end_users_phone_numbers');

    if(!existence) {
        return knex.schema
            .withSchema('bo')
            .createTable('end_users_phone_numbers', function(table) {
                table.increments('id');
                table.string('phone_number');
                table.integer('user_id').unsigned().notNullable();
                table.foreign('user_id').references('id').inTable('bo' + '.end_users');
                table.timestamps(false, true);
            });
    }
};

exports.down = async function(knex) {

    const existence = await knex.schema
        .withSchema('bo')
        .hasTable('end_users_phone_numbers');

    if(existence) {
        return knex.schema
            .withSchema('bo')
            .dropTable('end_users_phone_numbers');
    }
};
