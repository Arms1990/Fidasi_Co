const BackOfficeModel = require('./BackOfficeModel');
const OAuthClient = require('./OAuthClient');
const User = require('./User');

class OAuthAccessToken extends BackOfficeModel {

  static get tableName() {
    return 'oauth_access_tokens';
  }

  static get relationMappings() {
    return {
      client: {
        relation: BackOfficeModel.BelongsToOneRelation,
        modelClass: OAuthClient,
        join: {
          from: this.tableName + '.client_id',
          to: OAuthClient.tableName + '.id'
        }
      },
      user: {
        relation: BackOfficeModel.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: this.tableName + '.user_id',
          to: User.tableName + '.id'
        }
      }
    };
  }

}

module.exports = OAuthAccessToken;