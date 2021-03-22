const fs = require('fs');
const path = require('path');


const basename = path.basename(__filename);
const excludedFiles = [ basename ];

const topics = {};

fs.readdirSync(__dirname)
    .filter( file => (file.indexOf('.') !== 0) && (!excludedFiles.includes(file)) && (file.slice(-3) === '.js') )
    .forEach( file => {
        const topic = require(path.join(__dirname, file));
        topics[topic.topic] = topic;
    });

module.exports = {
    ...topics
};