var prefix = "d!"
var Discord = require("discord.js");
var nodeCleanup = require('node-cleanup');
var colors = require('colors');
var json = require('jsonfile');
// var translate = require('@vitalets/google-translate-api');
// var urban = require('urban.js');
// var probe = require('probe-image-size');
// var download = require('image-downloader')



var codes = json.readFileSync('../codes/destroyer/code.json');
var config = json.readFileSync('./config.json');

// var total = json.readFileSync('./total.json');

var Updater = require('./updater.js')
var quoteManager = require('./quoteManager.js');
var embedManager = require('./embedManager.js');
var searchManager = require('./searchManager.js');
var statManager = require('./statManager.js');

var google = require('google')
google.resultsPerPage = 5;

class Destroyer {

	constructor() {
		console.log("Making new Destroyer")

		this.client = new Discord.Client();

		this.updater = new Updater({name: "Jordan 2.0", desc: "it's jordan! 2.0! now with better updater."});
		this.embeds = new embedManager();

		this.stats = new statManager(this.embeds, this.errHandler);
		this.quotes = new quoteManager(this.embeds, this.stats, this.errHandler);
		this.searcher = new searchManager(codes, this.embeds, this.errHandler);

		this.config = config

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

		this.client.login(codes.token);
	};

	errHandler(err) {
		console.log("There was an error!".bold.red)
		console.log(`${err}`.red)
		this.searcher.lastMessage.channel.send(this.embeds.error(err));
	}

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



		// these get deleted after use, so don't store a reference to them.
		if(["n", "next"].includes(command)) {
			this.searcher.getOffsetGlobalScrollIndex(1);
			message.delete()
		}

		if(["b", "back"].includes(command)) {
			this.searcher.getOffsetGlobalScrollIndex(-1);
			message.delete()
		}


		// the rest should stick around.
		// this is just used in lower functions so i don't have to pass a message variable down.
		this.searcher.lastMessage = message;


		// put anything that belongs behind the blacklist here, mostly just searches (yt, images, google, probably exclude urban.)
		this.waitForVote({prerequisite: this.checkWordsForBlacklist(args)})
		.then(res => {
			if(["s", "search"].includes(command)) {
				this.searcher.search(args);
				this.stats.trackStat("searched", author)
				this.stats.trackStat("commands", "search")
			}

			if(["ys", "youtube"].includes(command)) {
				this.searcher.ytSearch(args);
				this.stats.trackStat("youtubed", author)
				this.stats.trackStat("commands", "youtube")
			}

			if(["gif", "g"].includes(command)) {
				this.searcher.giphySearch(args);
				this.stats.trackStat("gifs", author)
				this.stats.trackStat("commands", "gifs")
			}
		})
		.catch((err) => this.errHandler(err))



		// these are all fine and are not checked against the blacklist


		if(["h", "help"].includes(command)) {
			message.channel.send(this.embeds.help(this.config.help));
			message.channel.send(this.embeds.alert("Confirmed, this feature is working."))
		}

		if(["q", "quote"].includes(command)) {
			this.quotes.findMessage(message, args);
			this.stats.trackStat("commands", "quote")
		}

		if(["sk", "skip"].includes(command)) {
			var i = 1;
			if(args != null) {i = parseInt(args);}
			this.searcher.getOffsetGlobalScrollIndex(i);
		}

		if(["c", "config"].includes(command)) {
			message.channel.send(this.embeds.config(this.config));
		}

		if(["st", "status"].includes(command)) {
			this.updater.get()
			.then(res => {
				message.channel.send(this.embeds.status(res));
			})
			.catch((err) => this.errHandler(err))
		}

		if(["l", "leaderboard"].includes(command)) {
			if(args != "") {
				message.channel.send(this.embeds.leaderboard(args, this.stats.getLeaderboard(args)));
			} else {
				message.channel.send(this.embeds.leaderboardList(this.stats.getStatNames()))
			}
		}

		// add a change config command;
	}


}


var jordan = new Destroyer();

