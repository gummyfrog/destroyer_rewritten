var Necessary = require('./necessary.js');
var fs = require('fs')
module.exports = class voice extends Necessary {

	constructor() {
		super();
	}

	playSound(msg, args) {
		var path = `./sounds/${args}.mp3`;
		if(msg.member.voiceChannel && fs.existsSync(path)) {
			msg.member.voiceChannel.join()
			.then((connection) => {
				var dispatcher = connection.playFile(path);
				dispatcher.on('end', () => {
					msg.member.voiceChannel.leave()
				});
			})
			.catch((err) => {
				console.log(err);
			})
		}
	}

}
