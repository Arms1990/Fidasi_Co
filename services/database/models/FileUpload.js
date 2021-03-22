const { Model } = require('objection');

class FileUpload extends Model {

  static get tableName() {
    return 'file_uploads';
  }

}

module.exports = FileUpload;