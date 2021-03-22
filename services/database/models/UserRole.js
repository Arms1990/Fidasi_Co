const BackOfficeModel = require('./BackOfficeModel');

class UserRole extends BackOfficeModel {

  static get tableName() {
    return 'user_roles';
  }

}

module.exports = UserRole;