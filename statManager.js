var json = require('jsonfile');

module.exports = class leaderboardManager {

	constructor(embedManager, err) {
		this.embeds = embedManager;
		this.errHandler = err
		this.stats = {};
	}

	trackStat() {

	}


}
