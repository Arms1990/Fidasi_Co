const BatchModels = require('./BatchModels');
// const User = require('./User');

class ContractOptima extends BatchModels {

  static get tableName() {
    return 'contractoptima';
  }

}

module.exports = ContractOptima;