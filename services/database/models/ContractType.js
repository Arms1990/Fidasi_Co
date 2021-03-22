const BackOfficeModel = require('./BackOfficeModel');
// const User = require('./User');

class ContractType extends BackOfficeModel {

  static get tableName() {
    return 'contract_type';
  }

}

module.exports = ContractType;