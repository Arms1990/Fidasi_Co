const BackOfficeModel = require('./BackOfficeModel');

class EndUserPhoneNumber extends BackOfficeModel {

  static get tableName() {
    return 'end_users_phone_numbers';
  }

}

module.exports = EndUserPhoneNumber;