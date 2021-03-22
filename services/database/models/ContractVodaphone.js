const BatchModels = require('./BatchModels');
// const User = require('./User');

class ContractVodaphone extends BatchModels {

  static get tableName() {
    return 'contractvodaphone';
  }

}

module.exports = ContractVodaphone;