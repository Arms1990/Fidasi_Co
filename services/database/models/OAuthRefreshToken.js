const BackOfficeModel = require('./BackOfficeModel');
const OAuthClient = require('./OAuthClient');
const User = require('./User');
const OAuthAccessToken = require('./OAuthAccessToken');

class OAuthRefreshToken extends BackOfficeModel {

  static get tableName() {
    return 'oauth_refresh_tokens';
  }

  static get relationMappings() {
    return {
      accessToken: {
        relation: BackOfficeModel.BelongsToOneRelation,
        modelClass: OAuthAccessToken,
        join: {
          from: this.tableName + '.access_token_id',
          to: OAuthAccessToken.tableName + '.id'
        }
      },
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

module.exports = OAuthRefreshToken;