var Necessary = require('./necessary.js');
var { NlpManager } = require('node-nlp');

module.exports = class chatter extends Necessary {

	constructor() {
		super();
		this.manager = new NlpManager({ languages: ['en'] });			
		this.manager.load(`${process.cwd()}/misc/model.nlp`)	
		this.conversingStatus = false;

		this.manager.addDocument('en', 'search for an image', 'commands.imageSearch');
		this.manager.addDocument('en', 'hi', 'jordan.greetings');	
		this.manager.addDocument('en', 'hi jordan', 'jordan.greetings');	
		this.manager.addDocument('en', "what's up jordan", 'jordan.greetings');	

		this.manager.addAnswer('en', 'commands.imageSearch', 'ok search for what??');
		this.manager.addAnswer('en', 'jordan.greetings', 'hiiii');
		this.manager.addAnswer('en', 'jordan.greetings', 'woooa');

		this.associations = [];
	}

	check(message) {
		this.learn(message)

		if(!this.conversingStatus) {
			this.tryStart(message);
		} else if(message.content.toLowerCase() == "bye jordan" && this.conversingStatus) {
			this.stop(message);
		} else if(this.conversingStatus) {
			this.ask(message);
		}
	}

	learn(message) {
		if(this.associations.length != 0) {
			console.log(`Tracked Question: ${this.associations[0].user}: ${this.associations[0].txt} ?`)
		}

		if(this.associations.length == 0 || this.associations[0].user != message.author.username) {
			this.associations.push({txt: message.content, user: message.author.username});
		}

		if(this.associations.length == 2) {
			this.dlog(`${this.associations[0].user}: ${this.associations[0].txt} ?`)
			this.dlog(`${this.associations[1].user}: ${this.associations[1].txt} .`)

			this.manager.addDocument('en', this.associations[0].txt, 'associations');
		    this.manager.addAnswer('en', 'associations', this.associations[1].txt);
		    this.associations = [];
		}
	}


	tryStart(message) {
		(async() => {
			const response = await this.manager.process('en', message.content)
			if(response.classifications[0].label == 'jordan.greetings') {
				this.conversingStatus = true;
				message.channel.send(response.answer);
			}
		})()
	}


	ask(message) {
		(async() => {
		    await this.manager.train();
		    this.manager.save(`${process.cwd()}/misc/model.nlp`)

		    const response = await this.manager.process('en', message.content);
		    this.dlog(response);

		    if(response.answer) {
		    	this.dlog(response.classifications[0])
		    	this.manager.addDocument('en', message.content, response.classifications[0].label);
		    	message.channel.send(response.answer)
		    }
		})();
	}

	stop(message) {
		message.channel.send("cyaaa");
		this.conversingStatus = false;
	}

}
