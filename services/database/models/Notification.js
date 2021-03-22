const BackOfficeModel = require('./BackOfficeModel');

class Notification extends BackOfficeModel {

  static get tableName() {
    return 'notifications';
  }


}

module.exports = Notification;