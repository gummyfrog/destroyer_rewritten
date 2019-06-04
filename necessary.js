var embeds = require('./managerial/embeds.js');
var stats = require('./managerial/stats.js');
var path = require('path');
var json = require('jsonfile');
// var appDir = path.dirname(require.main.filename);

module.exports = class Necessary {
	constructor() {
		this.codes = json.readFileSync('../codes/destroyer/code.json');
		this.embeds = new embeds(this.getConfig().colors);
		this.stats = new stats();
		this.errorHandler = this.errorHandler;
	}

	errorHandler(err, message = undefined) {
		console.log("There was an error!".bold.red);
		console.log(`${err}`.red);
		if(message) {message.channel.send(this.embeds.error(err))};
	}

	getConfig() {
		return json.readFileSync('config.json');
	}

	setConfig(where, what, config) {
		if(config[where] == undefined) return

		switch(typeof(config[where])) {
			case "string": 
				config[where] = what;
				break;
			case "boolean":
				config[where] = what.toLowerCase() == 'true' ? true : false;
				break;
			case "object":
				if(config[where].constructor === Array) {
					if(what == '-') {
						config[where].pop();
					} else {
						config[where].push(what);
					}
				}
				break;
			default:
				break;
		}

		json.writeFileSync('config.json', config);
	}
}
