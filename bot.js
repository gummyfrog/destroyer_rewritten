/* jshint esversion:6*/

const Discord = require("discord.js");
const nodeCleanup = require('node-cleanup');
const colors = require('colors');
const json = require('jsonfile');
const fs = require('fs');

// var urban = require('urban.js');
// var probe = require('probe-image-size');
// var download = require('image-downloader')
// var total = json.readFileSync('./total.json');

const Necessary = require('./managers/necessary.js');

class Destroyer extends Necessary {

	constructor() {
		super();
		this.dlog(`Making a new Destroyer.`);

		this.client = new Discord.Client({
		    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_PRESENCES", "GUILD_WEBHOOKS", "GUILD_MESSAGE_REACTIONS"]
		});
		this.commands = new Discord.Collection();
		this.managers = new Discord.Collection();
		this.help = {};
		this.managerList = {};

		console.log("Loading Managers...".bold);
		fs.readdirSync('./managers').filter(file => file.endsWith('.js')).map((file) => {
			var manager = require(`./managers/${file}`);
			this.managers.set(manager.name, new manager());
			this.dlog(`${manager.name}; ./managers/${file}`.bold);
			this.managerList[`${manager.name}`] = `⮑ ./managers/${file}`;
		});	

		this.dlog(`${this.managers.array().length}  Managers Loaded from directory.`.bold);
		this.managers.set("getConfig", this.getConfig);
		this.managers.set("setConfig", this.setConfig);
		this.managers.set("help", this.help);
		this.managers.set("managerList", this.managerList);
		console.log(`${this.managers.array().length} Total Managers Loaded Successfully.`.bold);

		fs.readdirSync('./commands').filter(file => file.endsWith('.js')).map((file) => {
			var command = require(`./commands/${file}`);
			this.dlog(`${command.name}; ./commands/${file}`.bold);
			for(var k=0; k<command.keys.length;k++) {
				this.commands.set(command.keys[k], command);
			}

			var command_info = `⮑ ${command.description}`;
			if(command.example) {
				command_info += `\ne.g: ${command.example}`;
			}

			this.help[`${command.name} **(${command.keys.join(' or ')})**`] = command_info;
		});

		// set client events


		this.client.on("ready", () => {
			console.log(`Jordan ${this.package.version} Online.`.italic.bold);
			if(process.env.DEBUG) {
				this.dlog("Debug Mode is Enabled");
			}
			this.dlog("Verbose is Enabled.");
			this.client.user.setPresence({
				activity: {
					name: `Jordan ${this.package.version} :)`,
					type: "STREAMING",
					url: "https://www.youtube.com/watch?v=EwdWgAMYcqk4"
				}
			});
		});

		this.client.on("messageCreate", (message) => {
			if(message.author.id === this.client.user.id) return;
			if(process.env.DEBUG && message.guild.id != "352103491948511233") return;
			if(!process.env.DEBUG && message.guild.id == "352103491948511233") return;

			this.dlog(`${message.author.tag} : ${message.content}`);
			this.commandHandler(message);
		});

		this.dlog("Waiting for discord...");
		this.client.login(this.codes.token);
	}

	checkWordsForBlacklist(words) {	
		return words.split(' ').some((e) => {return this.getConfig().blacklist.includes(e) || this.getConfig().blacklist.includes(words);});
	}

	waitForVote(message, passOpt = {}) {
		return new Promise((resolve, reject) => {
			var opt = Object.assign({
				res: 3,
				rej: 2,
				pos: this.getConfig().pos,
				neg: this.getConfig().neg,
				prerequisite: true,
			}, passOpt);

			if(process.env.DEBUG) {
				opt.res = 2;
			}

			if(!opt.prerequisite) {
				resolve();
				return; 
			}

			var voteEmbed = this.embeds.vote();
			message.channel.send(voteEmbed).then((votingMessage) => {
				votingMessage.react(opt.pos).then((res) => {
					votingMessage.react(opt.neg);
				});
				
				const collector = votingMessage.createReactionCollector((reaction, user) => 
					[opt.pos, opt.neg].includes(reaction.emoji.name), { time: 0 });
				collector.on('collect', (r) => {
					if(r.emoji.name === opt.pos && r.users.size == opt.res) {
						// resolve
						resolve();
						collector.stop();

					} else if(r.emoji.name === opt.neg && r.users.size == opt.rej) {
						// reject
						if(this.getConfig().deletevotes) {
							votingMessage.delete();
						} else {
							votingMessage.edit(this.embeds.cancelledVote(69));
						}
						reject("Downvoted to hell");
						collector.stop();
					}
				});
			});
		});
	}

	commandHandler(message) {
		if(message.content.substring(0, this.getConfig().prefix.length).toLowerCase() != this.getConfig().prefix) return;
		if(message.webhookID) return;
		
		var command = message.content.toLowerCase().substring(this.getConfig().prefix.length).split(' ')[0];
		var args = message.content.toLowerCase().substring(this.getConfig().prefix.length + command.length + 1).toLowerCase();  
		var author = message.author;
		
		if(message.guild === null) {
			// direct message
			console.log(`From "${message.author.username}"`.yellow);
			message.channel.send("use me in a channel or don't use me at all, cringe idiot");
			return;
		} else {
			this.dlog(`From "${message.guild.name}"`.green);
		}	

		if (!this.commands.has(command)) return;
		var toExecute = this.commands.get(command);

		this.waitForVote(message, {prerequisite: (toExecute.blacklisted && this.getConfig().voting && this.checkWordsForBlacklist(args))})
		.then(res => {
			try {
				var requiredObject = {};

				if(toExecute.required) {
					toExecute.required.map( (required) => {
						requiredObject[required] = this.managers.get(required);
					});
				}
				
				toExecute.execute(message, args, requiredObject);
			}
			catch(err) {
				this.errorHandler(err);
			}
		})
		.catch(err => {
			this.errorHandler(err);
		});
	}
}

var jordan = new Destroyer();
