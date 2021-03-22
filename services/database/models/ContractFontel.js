const BatchModels = require('./BatchModels');
// const User = require('./User');

class ContractFontel extends BatchModels {

  static get tableName() {
    return 'contractfontel';
  }

}

module.exports = ContractFontel;