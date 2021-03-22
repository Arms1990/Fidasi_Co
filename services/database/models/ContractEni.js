const BatchModels = require('./BatchModels');
// const User = require('./User');

class ContractEni extends BatchModels {

  static get tableName() {
    return 'contracteni';
  }

}

module.exports = ContractEni;