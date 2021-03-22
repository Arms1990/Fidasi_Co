const BackOfficeModel = require('./BackOfficeModel');

class Status extends BackOfficeModel {

  static get tableName() {
    return 'statuses';
  }


}

module.exports = Status;