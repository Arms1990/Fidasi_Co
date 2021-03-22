const BackOfficeModel = require('./BackOfficeModel');
const Role = require('./Role');
const OAuthClientRole = require('./OAuthClientRole');
const User = require('./User');

class OAuthClient extends BackOfficeModel {

  static get tableName() {
    return 'oauth_clients';
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
      roles: {
        relation: BackOfficeModel.ManyToManyRelation,
        modelClass: Role,
        join: {
          from: this.tableName + '.id',
          through: {
            from: OAuthClientRole.tableName + '.client_id',
            to: OAuthClientRole.tableName + '.role_id'
          },
          to: Role.tableName + '.id'
        }
      }
    };
  }


}

module.exports = OAuthClient;