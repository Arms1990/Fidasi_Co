const BackOfficeModel = require('./BackOfficeModel');
// const User = require('./User');

class Address extends BackOfficeModel {

  static get tableName() {
    return 'addresses';
  }

}

module.exports = Address;