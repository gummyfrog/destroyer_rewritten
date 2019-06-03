var embeds = require('./managerial/embeds.js');
var stats = require('./managerial/stats.js');
var path = require('path');
var json = require('jsonfile');
// var appDir = path.dirname(require.main.filename);

module.exports = class Manager {
	constructor() {
		this.codes = json.readFileSync('../codes/destroyer/code.json');
		this.config = json.readFileSync('config.json');
		this.embeds = new embeds(this.config.colors);
		this.stats = new stats();
		this.errorHandler = this.errorHandler;
	}

	errorHandler(err, message = undefined) {
		console.log("There was an error!".bold.red);
		console.log(`${err}`.red);
		if(message) {message.channel.send(this.embeds.error(err))};
	}
}
