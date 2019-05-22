var json = require('jsonfile');

module.exports = class statManager {

	constructor(embedManager, err) {
		this.embeds = embedManager;
		this.errHandler = err
		this.stats = json.readFileSync('./stats.json');
	}



 	trackStat(stat, what, value = 1) {
 		var w = what;
 		if(typeof(what) == "Object" && what.id != undefined) {
 			w = what.id
 		}

		if(!this.stats[stat]["data"]) {
			this.stats[stat]["data"] = {};
		}
		
		if(!this.stats[stat]["data"][w]) {
			this.stats[stat]["data"][w] = 0;
		}

		this.stats[stat]["data"][w] = this.stats[stat]["data"][w] + value;
		 console.log(this.stats[stat]["data"])

		json.writeFileSync('./stats.json', this.stats);
	}

	getStat(stat, who) {
		
	}


}
