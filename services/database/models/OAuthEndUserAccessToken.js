const BackOfficeModel = require('./BackOfficeModel');
const EndUser = require('./EndUser');

class OAuthEndUserAccessToken extends BackOfficeModel {

  static get tableName() {
    return 'oauth_end_user_access_tokens';
  }

  static get relationMappings() {
    return {
      user: {
        relation: BackOfficeModel.BelongsToOneRelation,
        modelClass: EndUser,
        join: {
          from: this.tableName + '.user_id',
          to: EndUser.tableName + '.id'
        }
      }
    };
  }

}

module.exports = OAuthEndUserAccessToken;