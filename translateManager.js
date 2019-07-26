var Necessary = require('./necessary.js');
var lang = require('./lang.js')
var translate = require('translate-google');

module.exports = class traslator extends Necessary {

	constructor() {
		super();
		this.lang = 'en';
	}

	translate(message, args) {
		console.log(args);
		translate(args, {to: this.lang})
		.then((res) => {
		  	console.log(res);
		  	message.delete()
		  	message.channel.send(this.embeds.translation(args, res))
		})
		.catch((err) => this.errorHandler(err, message))

	}

	changelang(message, args) {
		if(lang.isSupported(args)) {
			this.lang = lang.getCode(args);
			message.channel.send(this.embeds.translation(`Messages`, `${args}`))
		} else {
			this.errorHandler(`${args} is not a valid language code.`, message)
		}
	}

}
