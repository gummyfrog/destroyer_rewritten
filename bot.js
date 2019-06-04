var prefix = "d!"
var Discord = require("discord.js");
var nodeCleanup = require('node-cleanup');
var colors = require('colors');
var json = require('jsonfile');
var fs = require('fs');

// var translate = require('@vitalets/google-translate-api');
// var urban = require('urban.js');
// var probe = require('probe-image-size');
// var download = require('image-downloader')
// var total = json.readFileSync('./total.json');

var Updater = require('./updater.js');
var QuoteManager = require('./quoteManager.js');
var SearchManager = require('./searchManager.js');
var ScrollManager = require('./ScrollManager.js');
var Necessary = require('./necessary.js');

class Destroyer extends Necessary {

	constructor() {
		console.log("Making new Destroyer")

		super();
		this.client = new Discord.Client();
		this.commands = new Discord.Collection();
		this.managers = new Discord.Collection();
		this.help = {};


		this.updater = new Updater({name: "Jordan 2.0", desc: "it's jordan! 2.0! now with better updater."});
		this.quotes = new QuoteManager();
		this.scroll = new ScrollManager();
		this.searcher = new SearchManager();

		// manager is not a good name for these

		this.managers.set("quotes", this.quotes);
		this.managers.set("searcher", this.searcher);
		this.managers.set("scroll", this.scroll);
		this.managers.set("embeds", this.embeds);
		this.managers.set("stats", this.stats);
		this.managers.set("config", this.config)
		this.managers.set("help", this.help)

		fs.readdirSync('./commands').filter(file => file.endsWith('.js')).map((file) => {
			var command = require(`./commands/${file}`);
			this.commands.set(command.name, command);
			this.help[command.name] = `${command.description}`
		});

		this.client.on("ready", () => {
			console.log("I am ready!".green);
			if(process.env.DEBUG) {
				console.log("Debug Mode is Enabled".bold.red);
				this.embeds.monocolor(16728663)
			}
		});

		this.client.on("message", (message) => {
			this.commandHandler(message);
		});

		this.client.login(this.codes.token);
	};

	checkWordsForBlacklist(words) {
		return words.split(' ').some((e) => {return this.config.blacklist.includes(e)});
	}

	waitForVote(passOpt = {}) {
		return new Promise((resolve, reject) => {
			var opt = Object.assign({
				res: 3,
				rej: 2,
				pos: this.config.pos,
				neg: this.config.neg,
				prerequisite: true,
			}, passOpt)

			if(process.env.DEBUG) {
				opt.res = 2;
			}

			if(!opt.prerequisite) {
				resolve();
				return; 
			}

			var voteEmbed = this.embeds.vote();
			this.searcher.lastMessage.channel.send(voteEmbed).then((votingMessage) => {
				// this makes the order of the reactions kind of random, hehe
				votingMessage.react(opt.pos).then((res) => {
					votingMessage.react(opt.neg)
				});
				const collector = votingMessage.createReactionCollector((reaction, user) => 
					[opt.pos, opt.neg].includes(reaction.emoji.name), { time: 0 });
				collector.on('collect', (r) => {
					if(r.emoji.name === opt.pos && r.users.size == opt.res) {
						// resolve
						resolve();
						return; // not too sure if these returns are actually, need to check the docs

					} else if(r.emoji.name === opt.neg && r.users.size == opt.rej) {
						// reject

						if(this.config.deletevotes) {
							votingMessage.delete();
						} else {
							votingMessage.edit(this.embeds.cancelledVote(69));
						}
						reject("Downvoted to hell");
						return; // not too sure if these returns are necessary, need to check the docs
					}
				})
			})
		})
	}

	commandHandler(message) {
		if(message.author.id === this.client.user.id) return;
		if(message.content.substring(0, prefix.length).toLowerCase() != prefix) return;
		if(process.env.DEBUG && message.guild.id != "352103491948511233") return;
		if(!process.env.DEBUG && message.guild.id == "352103491948511233") return;

		var command = message.content.toLowerCase().substring(prefix.length).split(' ')[0];
		var args = message.content.toLowerCase().substring(prefix.length + command.length + 1).toLowerCase();  
		var author = message.author;

		if(message.guild === null) {
			// direct message
			console.log(`From "${message.author.username}"`.yellow);
			message.channel.send("sorry, use me in a channel or don't use me at all B) B) marry me?");
			return;
		} else {
			console.log(`From "${message.guild.name}"`.green);
			this.stats.trackStat("messager", author)
		}	

		if (!this.commands.has(command)) return;
		var toExecute = this.commands.get(command);

		this.waitForVote({prerequisite: (toExecute.blacklisted && this.checkWordsForBlacklist(args))})
		.then(res => {
			try {
				var requiredObject = {};

				if(toExecute.required) {
					toExecute.required.map( (required) => {
						requiredObject[required] = this.managers.get(required);
					});
				};

				toExecute.execute(message, args, requiredObject);
			}
			catch(err) {
				this.errorHandler(err);
			};
		})
		.catch(err => {
			this.errorHandler(err);
		});


		// add a change config command;
	}


}


var jordan = new Destroyer();

