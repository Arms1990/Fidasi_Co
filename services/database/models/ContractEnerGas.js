const BatchModels = require('./BatchModels');
// const User = require('./User');

class ContractEnerGas extends BatchModels {

  static get tableName() {
    return 'contractenergas';
  }

}

module.exports = ContractEnerGas;