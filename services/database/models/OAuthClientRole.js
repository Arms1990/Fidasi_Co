const BackOfficeModel = require('./BackOfficeModel');

class OAuthClientRole extends BackOfficeModel {

  static get tableName() {
    return 'oauth_client_roles';
  }
}

module.exports = OAuthClientRole;