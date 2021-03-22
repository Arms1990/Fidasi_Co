const BackOfficeModel = require('./BackOfficeModel');

class EndUser extends BackOfficeModel {

  static get tableName() {
    return 'end_users';
  }


}

module.exports = EndUser;