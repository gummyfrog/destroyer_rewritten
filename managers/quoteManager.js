/* jshint esversion:8 */

const Necessary = require('./necessary.js');
const { Webhook, MessageBuilder } = require('discord-webhook-node');
const imageDownloader = require('image-downloader');

module.exports = class quotes extends Necessary {

	constructor() {
		super();
		this.Hook = new Webhook("https://discord.com/api/webhooks/826610284059164713/s5DU4z2fXYNdSLbS53H-vAkEyCxe9wGAY2J6ku0vZqig_fi-Gm538kD4bVigjRKJLhwM")
	}

	webhookquote(quoteData) {	
		this.Hook.setUsername(`${quoteData.nickname} (${quoteData.tag})`);
		this.Hook.setAvatar(quoteData.avatar);

		if(quoteData.message != "") {
			this.Hook.send(quoteData.message);
		}

		for(var x=0;x<quoteData.attachments.length;x++) {
			var attachment = quoteData.attachments[x];
			var path = `./images/`;

			imageDownloader.image({url: attachment.url, dest: path})
			.then(({filename}) => {
				this.Hook.sendFile(`${filename}`);
			})
			.catch((err) => {
				console.log(err);
			});

		}

		// const embed = new MessageBuilder()
		// .setTimestamp();

		// this.Hook.send(embed);
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
		var searchedMsg = this.findMessage(message, args);
		searchedMsg.react("730962744378916874");

		// message.channel.send("Ok, here's the quote.", this.embeds.quote(searchedMsg));

		var quoteData = {
			name: searchedMsg.author.username,
			nickname: searchedMsg.member.nickname,
			message: searchedMsg.content,
			url: searchedMsg.url,
			attachments: searchedMsg.attachments.array(),
			channelname: searchedMsg.channel.name,
			tag: searchedMsg.author.tag,
			time: searchedMsg.createdTimestamp,
			avatar: searchedMsg.author.avatarURL,
		};

		this.webhookquote(quoteData);
	}

	reference(message, args) {
		var searchedMsg = this.findMessage(message, args);
		message.channel.send(this.embeds.reference(searchedMsg));
	}
};

