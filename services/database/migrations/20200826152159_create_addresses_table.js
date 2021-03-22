const countries = require('../../helpers/countries.json');
const countriesMapped = countries.map( country => country.alpha2Code );

exports.up = async function(knex) {
    const existence = await knex.schema
        .withSchema('bo')
        .hasTable('addresses');

    if(!existence) {
        return knex.schema
            .withSchema('bo')
            .createTable('addresses', function(table) {
                table.increments('id');
                table.string('address');
                table.string('city');
                table.string('post_code');
                table.enu('country', countriesMapped);
                table.integer('user_id').unsigned().notNullable();
                table.foreign('user_id').references('id').inTable('bo' + '.users');
                table.timestamps(false, true);
            });
    }
};

exports.down = async function(knex) {

    const existence = await knex.schema
        .withSchema('bo')
        .hasTable('addresses');

    if(existence) {
        return knex.schema
            .withSchema('bo')
            .dropTable('addresses');
    }
};
