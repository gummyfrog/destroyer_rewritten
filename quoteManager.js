var Necessary = require('./necessary.js')

module.exports = class quoteManager extends Necessary {

	constructor() {
		super();
	}

	findMessage(message, args) {
		var archiveChannel = message.guild.channels.find((channel) => channel.name.toLowerCase().includes("archive"));
		var messages = message.channel.messages.array().reverse();
		var searchedMsg;
		var eMsg = "Couldn't find anything.";

		if(archiveChannel == undefined) {
			eMsg = "Couldn't find the archive channel."
		};

		messages.shift();

		if (args[0] == "<") {
			searchedMsg = messages.find((m) => m.author == message.mentions.members.first().user);
			eMsg = "Couldn't find any messages published by that user in my cache."

		} else if (args[0] == "i") {
			console.log(args.substring(1));
			searchedMsg = messages.find((m) => m.id == args.substring(1) )
			eMsg = "I couldn't find that message. It's probably not in my cache.";

		} else {
			searchedMsg = messages.find((m) => m.content.toLowerCase().includes(args));
			eMsg = "I couldn't find anything in my cache with that word in it.";
		}

		if(searchedMsg != undefined) {
			message.channel.send("Ok, here's the quote.", this.embeds.quote(searchedMsg))
			archiveChannel.send(this.embeds.quote(searchedMsg));

			this.stats.trackStat("quoting", message.author);
			this.stats.trackStat("quoted", searchedMsg.author);

		} else {
			message.channel.send(this.embeds.alert(eMsg))
		};

	}
}

