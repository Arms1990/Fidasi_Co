const fs  = require('fs');
const path = require('path');


const basename = path.basename(__filename);
const excludedFiles = [ basename ];

const consumers = {};

fs.readdirSync(__dirname)
    .filter( file => (file.indexOf('.') !== 0) && (!excludedFiles.includes(file)) && (file.slice(-3) === '.js') )
    .map( (file) => {
        const consumer = require(path.join(__dirname, file));
        consumers[consumer.name] = consumer;
    });

module.exports = {
    ...consumers
};