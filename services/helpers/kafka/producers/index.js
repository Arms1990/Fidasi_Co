const fs = require('fs');
const path  = require( 'path');


const basename = path.basename(__filename);
const excludedFiles = [ basename ];

const producers = {};

fs.readdirSync(__dirname)
    .filter( file => (file.indexOf('.') !== 0) && (!excludedFiles.includes(file)) && (file.slice(-3) === '.js') )
    .forEach( file => {
        const producer = require(path.join(__dirname, file));
        producers[producer.name] = producer;
    });

module.exports = {
    ...producers
};