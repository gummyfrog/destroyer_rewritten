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

var Updater = require('./updater.js')
var QuoteManager = require('./quoteManager.js');
var SearchManager = require('./searchManager.js');
var Manager = require('./manager.js')


var google = require('google')
google.resultsPerPage = 5;

class Destroyer extends Manager {

	constructor() {
		console.log("Making new Destroyer")

		super();
		this.client = new Discord.Client();
		this.client.commands = new Discord.Collection();
		this.managers = new Discord.Collection();


		this.updater = new Updater({name: "Jordan 2.0", desc: "it's jordan! 2.0! now with better updater."});
		this.quotes = new QuoteManager();
		this.searcher = new SearchManager();

		this.managers.set("quotes", this.quotes);
		this.managers.set("searcher", this.searcher);

		fs.readdirSync('./commands').filter(file => file.endsWith('.js')).map((file) => {
			var command = require(`./commands/${file}`);
			this.client.commands.set(command.name, command);
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

			console.log(opt);

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
		console.log(command)
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



		if (!this.client.commands.has(command)) return;
		var toExecute = this.client.commands.get(command);

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



		// put anything that belongs behind the blacklist here, mostly just searches (yt, images, google, probably exclude urban.)
		// this.waitForVote({prerequisite: this.checkWordsForBlacklist(args)})
		// .then(res => {
		// 	if(["s", "search"].includes(command)) {
		// 		this.searcher.search(args);
				// this.stats.trackStat("searched", author)
		// 		this.stats.trackStat("commands", "search")
		// 	}

		// 	if(["ys", "youtube"].includes(command)) {
		// 		this.searcher.ytSearch(args);
		// 		this.stats.trackStat("youtubed", author)
		// 		this.stats.trackStat("commands", "youtube")
		// 	}

		// 	if(["gif", "g"].includes(command)) {
		// 		this.searcher.giphySearch(args);
		// 		this.stats.trackStat("gifs", author)
		// 		this.stats.trackStat("commands", "gifs")
		// 	}
		// })
		// .catch((err) => {
		// 	if(err != "Downvoted to hell") {
		// 		this.errHandler(err)
		// 	};
		// });



		// // these are all fine and are not checked against the blacklist


		// if(["h", "help"].includes(command)) {
		// 	message.channel.send(this.embeds.help(this.config.help));
		// 	message.channel.send(this.embeds.alert("Confirmed, this feature is working."))
		// }

		// if(["q", "quote"].includes(command)) {
		// 	this.quotes.findMessage(message, args);
		// 	this.stats.trackStat("commands", "quote")
		// }

		// if(["sk", "skip"].includes(command)) {
		// 	var i = 1;
		// 	if(args != null) {i = parseInt(args);}
		// 	this.searcher.getOffsetGlobalScrollIndex(i);
		// }

		// if(["c", "config"].includes(command)) {
		// 	message.channel.send(this.embeds.config(this.config));
		// }

		// if(["st", "status"].includes(command)) {
		// 	this.updater.get()
		// 	.then(res => {
		// 		message.channel.send(this.embeds.status(res));
		// 	})
		// 	.catch((err) => this.errHandler(err))
		// }

		// if(["l", "leaderboard"].includes(command)) {
		// 	if(args != "") {
		// 		message.channel.send(this.embeds.leaderboard(args, this.stats.getLeaderboard(args)));
		// 	} else {
		// 		message.channel.send(this.embeds.leaderboardList(this.stats.getStatNames()))
		// 	}
		// }

		// add a change config command;
	}


}


var jordan = new Destroyer();

