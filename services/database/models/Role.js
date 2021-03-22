const BackOfficeModel = require('./BackOfficeModel');

class Role extends BackOfficeModel {

  static get tableName() {
    return 'roles';
  }

}

module.exports = Role;