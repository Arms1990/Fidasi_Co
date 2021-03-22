const countries = require('../../helpers/countries.json');
const countriesMapped = countries.map( country => country.alpha2Code );

exports.up = async function(knex) {
    const existence = await knex.schema
        .withSchema('bo')
        .hasTable('end_users_addresses');

    if(!existence) {
        return knex.schema
            .withSchema('bo')
            .createTable('end_users_addresses', function(table) {
                table.increments('id');
                table.string('address');
                table.string('city');
                table.string('postal_code');
                table.string('country');
                // table.enu('country', countriesMapped);
                table.integer('user_id').unsigned().notNullable();
                table.foreign('user_id').references('id').inTable('bo' + '.end_users');
                table.timestamps(false, true);
            });
    }
};

exports.down = async function(knex) {

    const existence = await knex.schema
        .withSchema('bo')
        .hasTable('end_users_addresses');

    if(existence) {
        return knex.schema
            .withSchema('bo')
            .dropTable('end_users_addresses');
    }
};
