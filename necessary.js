var embeds = require('./managerial/embeds.js');
var stats = require('./managerial/stats.js');
var path = require('path');
var json = require('jsonfile');
// var appDir = path.dirname(require.main.filename);

module.exports = class Necessary {
	constructor() {
		this.package = json.readFileSync('./package.json')
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
		console.log(where);
		console.log(what);
		var exists = where;
		if(where.split('.').length > 0) {
			exists = where.split('.')[0]
		};

		console.log(exists);

		if(config[exists] == undefined) {
			console.log('does not exist.');
			return
		};


		switch(typeof(config[exists])) {
			case "string": 
				config[exists] = what;
				break;
			case "boolean":
				config[exists] = what.toLowerCase() == 'true' ? true : false;
				break;
			case "object":
				if(config[exists].constructor === Array) {
					if(what == '-') {
						config[exists].pop();
					} else {
						config[exists].push(what);
					}
				} else {
					var split = where.split('.');
					console.log(split);
					console.log(config[split[0]][split[1]])
					if(config[split[0]][split[1]] != undefined) {
						config[split[0]][split[1]] = what;
					};
				}
				break;
			default:
				break;
		}

		json.writeFileSync('config.json', config);
	}
}
