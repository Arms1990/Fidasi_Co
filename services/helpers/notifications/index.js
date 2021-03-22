const fs = require('fs');
const path = require('path');

const functionsDirectory = path.resolve(__dirname, 'functions');

const basename = path.basename(__filename);
const functions = {};

const excludedFiles = [ basename ];

fs.readdirSync(functionsDirectory)
  .filter( file => (file.indexOf('.') !== 0) && (!excludedFiles.includes(file)) && (file.slice(-3) === '.js') )
  .forEach( file => {
    const dynamicFunction = require(path.join(functionsDirectory, file));
    functions[dynamicFunction.name] = dynamicFunction;
  });

module.exports = functions;