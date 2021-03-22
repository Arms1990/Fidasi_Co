const { Model } = require('objection');

class BatchModels extends Model {
    
    // Override the static `query` method to add a schema to each query
    static query(...args) {
        const query = super.query(...args);
        query.withSchema('batch');
        return query;
    }
    
}

module.exports = BatchModels;