/* jshint esversion:8 */

const Necessary = require('./necessary.js');
const { Webhook, MessageBuilder } = require('discord-webhook-node');
const imageDownloader = require('image-downloader');

module.exports = class quotes extends Necessary {

	constructor() {
		super();

		this.Hook = new Webhook("https://discord.com/api/webhooks/826610284059164713/s5DU4z2fXYNdSLbS53H-vAkEyCxe9wGAY2J6ku0vZqig_fi-Gm538kD4bVigjRKJLhwM");
		if(process.env.DEBUG) {
			this.Hook = new Webhook("https://discord.com/api/webhooks/834626255885959168/u3yUYycz67GuE2cEXG669iAfQboVG-a1TdfftQxM0RryuizQHqjbliojtBwPqAoNraah");
		}
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
		return new Promise((resolve, reject) => {
			if (args.length == 18 && !isNaN(args)) 
			{
				message.channel.messages.fetch(args)
				.then(msg => {
					resolve(msg);
				})
				.catch(err => {
					reject(`Couldn't find a message with ID ${args}`);
				});

			} else {
				var eMsg = "Unknown Error!";
				var searchedMsg;
				// could combine this with a message fetch. if needed
				var messages = message.channel.messages.cache.array().reverse();
				messages.shift();


				if (args[0] == "<") {
					searchedMsg = messages.find((m) => m.author == message.mentions.members.first().user);
					eMsg = "Couldn't find any messages published by that user in my cache.";
				} else {
					searchedMsg = messages.find((m) => m.content.toLowerCase().includes(args));
					eMsg = "I couldn't find anything in my cache with that word in it.";
				}


				if(searchedMsg != undefined) {
					resolve(searchedMsg);
				} else {
					reject(eMsg);
				}

			}
		});
	}

	quote(message, args, updater) {
		this.findMessage(message, args)
		.then(searchedMsg => {
			if(searchedMsg.webhookID) return;

			searchedMsg.react("730962744378916874");

			// message.channel.send("Ok, here's the quote.", this.embeds.quote(searchedMsg));
			// should remove unused properties at some point

			var quoteData = {
				name: searchedMsg.author.username,
				nickname: searchedMsg.member.nickname,
				message: searchedMsg.content,
				url: searchedMsg.url,
				attachments: searchedMsg.attachments.array(),
				channelname: searchedMsg.channel.name,
				tag: searchedMsg.author.tag,
				time: searchedMsg.createdTimestamp,
				avatar: searchedMsg.author.avatarURL(),
			};

			this.webhookquote(quoteData);

		})
		.catch(error => {
			message.channel.send(this.embeds.error(error));
		});
	}

	reference(message, args) {
		var searchedMsg = this.findMessage(message, args);
		message.channel.send(this.embeds.reference(searchedMsg));
	}
};

