const fs = require('fs');
const path = require('path');

const { Model } = require('objection');

const { baseKnex } = require('../../connections');

const basename = path.basename(__filename);
const db = {};

Model.knex(baseKnex);

const excludedFiles = [ basename, "BackOfficeModel.js" ];

fs.readdirSync(__dirname)
  .filter( file => (file.indexOf('.') !== 0) && (!excludedFiles.includes(file)) && (file.slice(-3) === '.js') )
  .forEach( file => {
    const model = require(path.join(__dirname, file));
    db[model.name] = model;
  });

module.exports = db;