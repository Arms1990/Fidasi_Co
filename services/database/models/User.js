const BackOfficeModel = require('./BackOfficeModel');
const UserRole = require('./UserRole');
const Role = require('./Role');
const Address = require('./Address');
const avatar = require('../../helpers/avatar/avatar');

class User extends BackOfficeModel {

  static get tableName() {
    return 'users';
  }

  async $beforeInsert(queryContext) {
    await super.$beforeInsert(queryContext);
    if(!this.image) {
      this.image = await avatar({
        text: `${this.first_name} ${this.last_name}`,
        width: 512,
        height: 512,
        fontSize: 180
      });
    }
  }

  async $beforeUpdate(opt, queryContext) {
    await super.$beforeUpdate(opt, queryContext);
    let name = "";
    if(this.first_name) {
      name = this.first_name;
    }
    if(this.last_name) {
      name = `${name} ${this.last_name}`;
    }
    if(name !== "") {
      this.image = await avatar({
        text: `${this.first_name} ${this.last_name}`,
        width: 512,
        height: 512,
        fontSize: 180
      });
    }
  }

  static get relationMappings() {
    return {
      roles: {
        relation: BackOfficeModel.ManyToManyRelation,
        modelClass: Role,
        join: {
          from: this.tableName + '.id',
          through: {
            from: UserRole.tableName + '.user_id',
            to: UserRole.tableName + '.role_id'
          },
          to: Role.tableName + '.id'
        }
      },
      addresses: {
        relation: BackOfficeModel.HasManyRelation,
        modelClass: Address,
        join: {
          from: this.tableName + '.id',
          to: Address.tableName + '.user_id'
        }
      }
      // client: {
      //   relation: BackOfficeModel.BelongsToOneRelation,
      //   modelClass: OAuthClient,
      //   join: {
      //     from: this.tableName + '.client_id',
      //     to: OAuthClient.tableName + '.id'
      //   }
      // }
    };
  }


}

module.exports = User;