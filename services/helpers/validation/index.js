
const { Rule } = require('../../database/models');
const { ruleStatuses } = require('../../database/enums');

const rulesLibrary = require('./validationRules');

const { RuleException } = require('../errors');


const validate = (name) => {
    return async (req, res, next) => {
        try {
            const rules = await Rule.query()
                .select('id', 'name', 'procedure', 'error_code', 'error_message')
                .where('name', name)
                .where('status', ruleStatuses.A)
                .where('client_id', req.user.client_id);
            rules.forEach( (rule) => {
                if(rulesLibrary[rule.procedure] && typeof(rulesLibrary[rule.procedure] === 'function')) {
                    const response = rulesLibrary[rule.procedure](req);
                    //continue validation
                    if(!response) {
                        throw new RuleException(rule.error_code, rule.error_message);
                    }
                } else {
                    throw new Error(`The specific rule *${rule.procedure}* does not exist. You can change this behaviour by disabling the rule from database or create a function named *${rule.procedure}* inside rules library.`);
                }
        
            } );
    
            return next();
        } catch(error) {
            return res.json({
                code: error.code || 500,
                message: error.message
            });
        }
    }
}

module.exports = {
    validate
};