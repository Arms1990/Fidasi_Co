const countries = require('../../helpers/countries.json');
const countriesMapped = countries.map( country => country.alpha2Code );

exports.up = async function(knex) {
    const existence = await knex.schema
        .withSchema('bo')
        .hasTable('statuses');

    if(!existence) {
        return knex.schema
            .withSchema('bo')
            .createTable('statuses', function(table) {
                table.increments('id');
                table.string('status');
                table.timestamps(false, true);
            });
    }
};

exports.down = async function(knex) {

    const existence = await knex.schema
        .withSchema('bo')
        .hasTable('statuses');

    if(existence) {
        return knex.schema
            .withSchema('bo')
            .dropTable('statuses');
    }
};
