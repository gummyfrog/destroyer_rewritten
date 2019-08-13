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
var ScrollManager = require('./scrollManager.js');
var TranslateManager = require('./translateManager.js');
var ChatterManager = require('./chatterManager.js');

var Necessary = require('./necessary.js');

class Destroyer extends Necessary {

	constructor() {
		console.log(`Making new Destroyer!`)

		super();
		this.client = new Discord.Client();
		this.commands = new Discord.Collection();
		this.managers = new Discord.Collection();
		this.help = {};


		this.updater = new Updater({name: "Jordan 2.0", desc: "it's jordan! 2.0! now with better updater."});
		this.quotes = new QuoteManager();
		this.scroll = new ScrollManager();
		this.searcher = new SearchManager();
		this.translator = new TranslateManager();
		this.chatter = new ChatterManager();

		// manager is not a good name for these

		this.managers.set("quotes", this.quotes);
		this.managers.set("searcher", this.searcher);
		this.managers.set("translator", this.translator);
		this.managers.set("scroll", this.scroll);
		this.managers.set("embeds", this.embeds);
		this.managers.set("stats", this.stats);
		this.managers.set("getConfig", this.getConfig);
		this.managers.set("setConfig", this.setConfig);
		this.managers.set("updater", this.updater);
		this.managers.set("chatter", this.chatter);
		this.managers.set("help", this.help);

		fs.readdirSync('./commands').filter(file => file.endsWith('.js')).map((file) => {
			var command = require(`./commands/${file}`);
			for(var k=0; k<command.keys.length;k++) {
				this.commands.set(command.keys[k], command);
			}
			this.help[`${command.name} **(${command.keys.join(' or ')})**`] = `⮑ ${command.description}`
		});

		this.client.on("ready", () => {
			console.log(`${this.package.version}`.bold.green)
			console.log("I am ready!".green);
			if(process.env.DEBUG) {
				console.log("Debug Mode is Enabled".bold.red);
				this.embeds.monocolor(16728663)
			}
		});

		this.client.on("message", (message) => {
			if(message.author.id === this.client.user.id) return;
			if(process.env.DEBUG && message.guild.id != "352103491948511233") return;
			if(!process.env.DEBUG && message.guild.id == "352103491948511233") return;


			if(message.content.toLowerCase() == "hi jordan" && !this.chatter.conversingStatus) {
				this.chatter.start(message);
			} else if(message.content.toLowerCase() == "bye jordan" && this.chatter.conversingStatus) {
				this.chatter.stop(message);
			} else if(this.chatter.conversingStatus) {
				this.chatter.ask(message);
			} else if (!this.chatter.conversingStatus && Math.random()*3 == 1 ) {
				this.chatter.learn(message)
			}


			console.log(`${message.author.tag} : ${message.content}`)
			if(message.attachments.first()) {
				for(var a=0;a<message.attachments.array().length;a++) {
					var attachment = message.attachments.array()[a];
					console.log(`Taking a snapshot.\n${attachment.filename}`.bold.green);
					this.updater.download(attachment.url, attachment.filename)
				}
			}
			this.commandHandler(message);
		});

		this.client.login(this.codes.token);
	};

	checkWordsForBlacklist(words) {	
		return words.split(' ').some((e) => {return this.getConfig().blacklist.includes(e) || this.getConfig().blacklist.includes(words)});
	}

	waitForVote(message, passOpt = {}) {
		return new Promise((resolve, reject) => {
			var opt = Object.assign({
				res: 3,
				rej: 2,
				pos: this.getConfig().pos,
				neg: this.getConfig().neg,
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
			message.channel.send(voteEmbed).then((votingMessage) => {
				votingMessage.react(opt.pos).then((res) => {votingMessage.react(opt.neg)});
				
				const collector = votingMessage.createReactionCollector((reaction, user) => 
					[opt.pos, opt.neg].includes(reaction.emoji.name), { time: 0 });
				collector.on('collect', (r) => {
					if(r.emoji.name === opt.pos && r.users.size == opt.res) {
						// resolve
						resolve();
						collector.stop()

					} else if(r.emoji.name === opt.neg && r.users.size == opt.rej) {
						// reject

						if(this.getConfig().deletevotes) {
							votingMessage.delete();
						} else {
							votingMessage.edit(this.embeds.cancelledVote(69));
						}
						reject("Downvoted to hell");
						collector.stop()
					}
				})
			})
		})
	}

	commandHandler(message) {
		if(message.content.substring(0, this.getConfig().prefix.length).toLowerCase() != this.getConfig().prefix) return;

		var command = message.content.toLowerCase().substring(this.getConfig().prefix.length).split(' ')[0];
		var args = message.content.toLowerCase().substring(this.getConfig().prefix.length + command.length + 1).toLowerCase();  
		var author = message.author;
		
		if(message.guild === null) {
			// direct message
			console.log(`From "${message.author.username}"`.yellow);
			message.channel.send("sorry, use me in a channel or don't use me at all B) B) marry me?");
			return;
		} else {
			console.log(`From "${message.guild.name}"`.green);
			// this.stats.trackStat("messager", author)
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

