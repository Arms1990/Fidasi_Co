const BackOfficeModel = require('./BackOfficeModel');
const OAuthClient = require('./OAuthClient');
const User = require('./User');

class OAuthAuthorizationCode extends BackOfficeModel {

  static get tableName() {
    return 'oauth_authorization_codes';
  }

  static get relationMappings() {
    return {
      user: {
        relation: BackOfficeModel.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: this.tableName + '.user_id',
          to: User.tableName + '.id',
        }
      },
      client: {
        relation: BackOfficeModel.BelongsToOneRelation,
        modelClass: OAuthClient,
        join: {
          from: this.tableName + '.client_id',
          to: OAuthClient.tableName + '.id',
        }
      },
    };
  }


}

module.exports = OAuthAuthorizationCode;