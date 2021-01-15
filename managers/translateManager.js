/* jshint esversion:6 */

const Necessary = require('./necessary.js');
const translate = require('translate-google');

module.exports = class translator extends Necessary {

	constructor() {
		super();
		this.currentLang = 'en';
		this.lang = require(`${process.cwd()}/misc/lang.js`);
	}

	translate(message, args) {
		console.log(args);
		translate(args, {to: this.currentLang})
		.then((res) => {
		  	console.log(res);
		  	message.delete();
		  	message.channel.send(this.embeds.translation(args, res));
		})
		.catch((err) => this.errorHandler(err, message));

	}

	changelang(message, args) {
		if(lang.isSupported(args)) {
			this.currentLang = this.lang.getCode(args);
			message.channel.send(this.embeds.translation(`Messages`, `${args}`));
		} else {
			this.errorHandler(`${args} is not a valid language code.`, message);
		}
	}

};
