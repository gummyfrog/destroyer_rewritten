var json = require('jsonfile');

module.exports = class statManager {

	constructor(embedManager, err) {
		this.embeds = embedManager;
		this.errHandler = err
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
		 console.log(this.stats[stat]["data"])

		json.writeFileSync('./stats.json', this.stats);
	}

	getLeaderboard(stat) {
		return(this.stats[stat])
	}

	getStatNames() {
		return this.stats;
	}


}
