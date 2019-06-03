var json = require('jsonfile');

module.exports = class stats { 

	constructor() {
		this.stats = json.readFileSync('./stats.json');
	}

 	trackStat(stat, who, value = 1) {
 		var w = who;
 		if(typeof(who) == "Object" && who.id != undefined) {
 			w = who.id
 		}
		
		if(!this.stats[stat]["data"][w]) {
			this.stats[stat]["data"][w] = 0;
		}

		this.stats[stat]["data"][w] = this.stats[stat]["data"][w] + value;
		
		json.writeFileSync('./stats.json', this.stats);
	}

	getLeaderboard(stat) {
		return(this.stats[stat])
	}

	getStatNames() {
		return this.stats;
	}


}
