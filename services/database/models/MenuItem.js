const BackOfficeModel = require('./BackOfficeModel');
const OAuthClient = require('./OAuthClient');
const Page = require('./Page');
const UserRole = require('./UserRole');

class MenuItem extends BackOfficeModel {

  static get tableName() {
    return 'menu_items';
  }

  static get relationMappings() {
    return {
      scope: {
        relation: BackOfficeModel.BelongsToOneRelation,
        modelClass: UserRole,
        join: {
          from: this.tableName + '.scope_id',
          to: UserRole.tableName + '.id'
        }
      },
      page: {
        relation: BackOfficeModel.BelongsToOneRelation,
        modelClass: Page,
        join: {
          from: this.tableName + '.page_id',
          to: Page.tableName + '.id'
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
      children: {
        relation: BackOfficeModel.HasManyRelation,
        modelClass: this,
        join: {
          from: this.tableName + '.id',
          to: this.tableName + '.parent_id'
        }
      }
    };
  };

}

module.exports = MenuItem;