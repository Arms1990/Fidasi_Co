const _ = require('lodash');
const gm = require('gm');
const font = __dirname + '/font.ttf';	
const materialColors = ['808080'];

module.exports = function(conf) {
	let width = _.get(conf, 'width', 150);
	let height = _.get(conf, 'height', 150);
	let text = _.toUpper(_.get(conf, 'text', '').trim());
	let bgColor = _.get(conf, 'bgColor', _.sample(materialColors)).replace(/#+/g, '');
	let fontColor = _.get(conf, 'fontColor', 'ffffff').replace(/#+/g, '');
	let fontSize = _.get(conf, 'fontSize', '60');
	return new Promise( (resolve, reject) => {
		try {
			gm(width, height, '#' + (bgColor || _.sample(materialColors)))
			.fill('#' + (fontColor || 'ffffff'))
			.font(font)
			.drawText(0, 0, text, 'Center')
			.fontSize(fontSize)
			.toBuffer('PNG', (err, buffer) => {
				if(err) {
					throw err;
				}
				resolve(`data:image/png;base64,${buffer.toString('base64')}`);
			})
		} catch(err) {
			reject(err);
		}
	});
}
