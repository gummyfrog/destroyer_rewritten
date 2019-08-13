var Necessary = require('./necessary.js');
var { NlpManager } = require('node-nlp');


module.exports = class chatter extends Necessary {

	constructor() {
		super();
		this.manager = new NlpManager({ languages: ['en'] });		
		this.conversingStatus = false;


		this.manager.addDocument('en', 'goodbye for now', 'greetings.bye');
		this.manager.addDocument('en', 'hi', 'greetings.hello');	
		this.manager.addAnswer('en', 'greetings.hello', 'Hey there!');
		this.manager.addAnswer('en', 'greetings.bye', 'see you soon!');
	}

	start(message) {
		this.conversingStatus = true;
	}

	ask(message) {
		(async() => {
		    await this.manager.train();
		    this.manager.save();
		    const response = await this.manager.process('en', message.content);
		    console.log(response);

		    if(response.answer) {
		    	message.channel.send(response.answer)
		    }

		    this.manager.addDocument('en', message.content, message.content.split(' ')[0])
		    this.manager.addAnswer('en', message.content.split(' ')[0], message.content)

		    
		})();
	}

	stop(message) {
		this.conversingStatus = false;
	}

}
