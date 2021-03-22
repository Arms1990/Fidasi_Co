const BackOfficeModel = require('./BackOfficeModel');

class Elaboration extends BackOfficeModel {

  static get tableName() {
    return 'elaborations';
  }


}

module.exports = Elaboration;