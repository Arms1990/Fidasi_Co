const { Model } = require('objection');

class BackOfficeModel extends Model {
    
    // Override the static `query` method to add a schema to each query
    static query(...args) {
        const query = super.query(...args);
        query.withSchema('bo');
        return query;
    }
    
}

module.exports = BackOfficeModel;