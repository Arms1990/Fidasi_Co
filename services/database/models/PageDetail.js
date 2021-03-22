const BackOfficeModel = require('./BackOfficeModel');
const Page = require('./Page');
const UserRole = require('./UserRole');


class PageDetail extends BackOfficeModel {

  static get tableName() {
    return 'page_details';
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
      }
    };
  };

}

module.exports = PageDetail;