
exports.up = function(knex) {
    return knex.schema
        .createSchemaIfNotExists('bo');
};

exports.down = function(knex) {
    return knex.schema
        .dropSchemaIfExists('bo');
};
