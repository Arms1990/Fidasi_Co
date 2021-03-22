const knex = require('knex');

knex.QueryBuilder.extend('upsert', function (conditionColumns, updatingColumns) {


    let query = this;
    
    const conditionColumnsObjectified = Object.entries(conditionColumns);
    conditionColumnsObjectified.forEach( conditionColumn => {
        query.where(conditionColumn[0], conditionColumn[1]);
    });

    const updatingColumnsObjectified = Object.entries(updatingColumns).map( updatingColumn => {
        let value = updatingColumn[1];
        return [ updatingColumn[0], value.value ];
    });
    const updatingColumnsObjectifiedForIncrement = Object.entries(updatingColumns).map( updatingColumn => {
        let value = updatingColumn[1];
        if(value.increment) {
            value = query.client.raw(`${updatingColumn[0]} + ${value.value || 1}`);
        } else {
            value = value.value;
        }
        return [ updatingColumn[0], value ];
    });
    return query.then( async (rows) => {
        if(rows.length === 0) {
            const insertQuery = query.returning('*').insert({
                ...conditionColumns,
                ...Object.fromEntries(updatingColumnsObjectified)
            });
            return await insertQuery;
        } else {
            const updateQuery = query.returning('*').update({
                ...Object.fromEntries(updatingColumnsObjectifiedForIncrement)
            });
            return await updateQuery;
        }
    })
    .catch( err => {
        throw new Error(err);
    });
});

const baseKnexConfig = require('./knexfile');
const baseKnex = knex(baseKnexConfig.development);


module.exports = {
    baseKnex
};