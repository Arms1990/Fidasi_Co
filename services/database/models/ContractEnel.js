const BatchModels = require('./BatchModels');
// const User = require('./User');

class ContractEnel extends BatchModels {

  static get tableName() {
    return 'contractenel';
  }

}

module.exports = ContractEnel;