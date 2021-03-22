const BackOfficeModel = require('./BackOfficeModel');

class PasswordReset extends BackOfficeModel {

  static get tableName() {
    return 'password_resets';
  }

}

module.exports = PasswordReset;