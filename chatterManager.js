var Necessary = require('./necessary.js');
var ElizaBot = require('elizabot');

module.exports = class chatter extends Necessary {

	constructor() {
		super();
		this.eliza = new ElizaBot();
		this.conversingStatus = false;
	}

	start(message) {
		this.conversingStatus = true;
		message.channel.send(this.eliza.getInitial());
	}

	ask(message) {
		console.log("chask")
		message.channel.send(this.eliza.transform(message.content));
	}

	stop(message) {
		this.conversingStatus = false;
		message.channel.send(this.eliza.getFinal())
	}

}
