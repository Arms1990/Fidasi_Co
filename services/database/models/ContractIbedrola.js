const BatchModels = require('./BatchModels');
// const User = require('./User');

class ContractIbedrola extends BatchModels {

  static get tableName() {
    return 'contractibedrola';
  }

}

module.exports = ContractIbedrola;