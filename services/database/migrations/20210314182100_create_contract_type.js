
exports.up = async function(knex) {
    const existence = await knex.schema
        .withSchema('bo')
        .hasTable('contract_type');

    if(!existence) {
        return knex.schema
            .withSchema('bo')
            .createTable('contract_type', function(table) {
                table.increments('id');
                table.string('name').notNullable();
                table.text('description').notNullable();
                table.timestamps(false, true);
            });
    }

};

exports.down = async function(knex) {
    const existence = await knex.schema
        .withSchema('bo')
        .hasTable('contract_type');

    if(existence) {
        return knex.schema
            .withSchema('bo')
            .dropTable('rolcontract_typees');
    }
};
