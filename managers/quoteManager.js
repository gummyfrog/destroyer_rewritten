/* jshint esversion:6 */

const Necessary = require('./necessary.js');

module.exports = class quotes extends Necessary {

	constructor() {
		super();
	}

	findMessage(message, args) {
		var messages = message.channel.messages.array().reverse();
		var searchedMsg;
		var eMsg = "Couldn't find anything.";

		messages.shift();

		if (args[0] == "<") {
			searchedMsg = messages.find((m) => m.author == message.mentions.members.first().user);
			eMsg = "Couldn't find any messages published by that user in my cache.";

		} else if (args.length == 18 && !isNaN(args)) {
			searchedMsg = messages.find((m) => m.id == args);
			eMsg = "I couldn't find that message. It's probably not in my cache.";

		} else {
			searchedMsg = messages.find((m) => m.content.toLowerCase().includes(args));
			eMsg = "I couldn't find anything in my cache with that word in it.";
		}	

		// just turn this into a promise

		if(searchedMsg != undefined) {
			return(searchedMsg);
		} else {
			return(undefined);
		}

	}

	quote(message, args, updater) {
		var archiveChannel = message.guild.channels.find((channel) => channel.name.toLowerCase().includes("archive"));
		if(archiveChannel == undefined) {
			return;
		}

		var searchedMsg = this.findMessage(message, args);

		message.channel.send("Ok, here's the quote.", this.embeds.quote(searchedMsg));
		archiveChannel.send(this.embeds.quote(searchedMsg));

		var quoteData = {
			name: searchedMsg.author.username,
			message: searchedMsg.content,
			attachments: searchedMsg.attachments,
			channelname: searchedMsg.channel.name,
			time: searchedMsg.createdTimestamp,
			avatar: searchedMsg.author.avatarURL,
		};

		updater.quote(quoteData);

	}

	reference(message, args) {
		var searchedMsg = this.findMessage(message, args);
		message.channel.send(this.embeds.reference(searchedMsg));

	}
};

