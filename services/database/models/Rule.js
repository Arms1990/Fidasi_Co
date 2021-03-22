const BackOfficeModel = require('./BackOfficeModel');
const OAuthClient = require('./OAuthClient');

class Rule extends BackOfficeModel {

  static get tableName() {
    return 'rules';
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
      }
    };
  }


}

module.exports = Rule;