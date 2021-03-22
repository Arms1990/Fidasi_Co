const BackOfficeModel = require('./BackOfficeModel');

class EndUserAddress extends BackOfficeModel {

  static get tableName() {
    return 'end_users_addresses';
  }

}

module.exports = EndUserAddress;