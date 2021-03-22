const BatchModels = require('./BatchModels');
// const User = require('./User');

class ContractIren extends BatchModels {

  static get tableName() {
    return 'contractiren';
  }

}

module.exports = ContractIren;