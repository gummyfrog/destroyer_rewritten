var prefix = "d!"
var Discord = require("discord.js");
var GoogleImages = require('google-images');
var nodeCleanup = require('node-cleanup');
var json = require('jsonfile');
var Updater = require('./updater.js')
var ytSearch = require('youtube-search');
var translate = require('@vitalets/google-translate-api');
var Twitter = require('twitter');
var urban = require('urban.js');
var gifSearch = require('gif-search');
var probe = require('probe-image-size');
var download = require('image-downloader')
var codes = json.readFileSync('../codes/destroyer/code.json');
var total = json.readFileSync('./total.json');
var nudity;
var google = require('google')

google.resultsPerPage = 5;

var titles = {
	"quoted":		[" 🎭 _performing for kings, highest in the land_", " 🎙 _performing a public service_", " 💐 _just a hobby_"],
	"quoting":		[" 💝 _saint quotingham_", " 🎁 _generous quoter_", " 📌 _itchy pin finger_"],
	"selfquote":	[" 🕴🏻 _narcissist_"],
	"executed":		[" 💣 _no-fly list_", " ⚠️ _slippery and wet_"],
	"warned":		[" 👨‍🎤 _true rebel_", " 🔪 _repeat offender_", " 🔬 _just testing the system_"],
	"searched":		[" 🔮 _seeker of knowledge_", " 🗞 _well informed brainer_"],
	"youtubed":		[" 🎥 _the producer_", " 📽 _the searcher_", " 🎞 _youtube fella_"],
	"me":			[" 🗿 _hahahaha what the fuck hahahahhaha_", " ♿️ _special olympics medalist_", " 🕯 _occult expert_"],
	"urban":		[" 🗼 _city slicker_"],
	"gamer":		[" 🎮 _you're already tracer_", " 📱 _has games on phone_"],
	"gambler":		[" 🎲 _live by the die_", " 🎰 _unhealthy addiction_"],
	"messager": 	[" 💅 _that's the tea sis_", " 🏅 _champion of the server, holder of knowledge_", " 🏆 _loyal, dedicated_"],
	"pokemon":		[" 🎒 _ass ketchup_", " 🐸 _pokemon trainer_", " 🐄 _farmer_"],
	"gifs": 		[" 🎞 _giffy boy_", " 🖼 _pro jiffer_", " 🥜 _peanut butter_"],
	"distance": 	[" 🥌 _keep scrollin' buddy_"],
};

var desc = {
	"quoted": "Times you've been quoted",
	"quoting": "Times you quoted someone else",
	"selfquote": "Times you quoted yourself",
	"executed": "Times nobody wanted to see your search",
	"warned": "Times you made a risky search",
	"searched": "Times you searched",
	"youtubed": "Times you searched youtube",
	"me": "Times you used this useless fucking command",
	"urban": "Times you searched the urban dictionary",
	"gamer": "Times you started a game with <@383995098754711555>",
	"gambler": "Times you gambled with <@383995098754711555>",
	"messager": "How many messages you've sent",
	"pokemon": "How many pokemon you've caught",
	"gifs": "Times you searched for a gif",
	"distance": "How many meters of distance you've scrolled through images with d!n and d!b"
}

var showValues = {
	"messager": "messages sent",
	"distance": "meters scrolled",
	"executed": "times shut down",
	"pokemon": "pokemon caught",
	"searched": "searches",
	"selfquote": "narcissism points",
	"quoting": "quotes handed out",
	"quoted": "quotes in your name",
}

var showFull = {
	"quoting":true,
	"warned":true,
}

var king = [" 🍜 hahaha ramen", " the runner up ramen", " e"]


nodeCleanup(function (exitCode, signal) {
	if (signal) {
		updater.post({'status':'offline'}).then(() => {
				process.kill(process.pid, signal);
			}).catch((e)=>{
				console.log('Site offline or invalid URL for cleanup.')
				process.kill(process.pid, signal);
			});
			nodeCleanup.uninstall(); // don't call cleanup handler again
			return false;
	}
});


let posEmojis = ["😀", "👌", "👍", "👆", "🤙", "🔥", "📈", "✅"];
let negEmojis = ["💩", "🖕", "👎", "👇", "👊", "🚫", "📉", "❎"];
var killList = ['nsfw', 'sexy','preg', 'furry', 'furrys', 'gore', 'hentai', 'boob', 'tit', 'ass', 'cum', 'dick', 'penis', 'vagina', 'porn', 'foot', 'feet', 'toe']
var ytOpts = {
  maxResults: 3,
};

var lastSearch = "none";
var latestEmbeds = [];
var embedIndex = 0;
var latestEmbedMessage = null;

var subtitles = false;
var brokenSubtitles = false;
var lang = 'nl';
var censor = false;
var wordFilter = true;


// lol

var updater = new Updater();
updater.name = "jordan";
updater.desc = "Jordan.";


var client = new Discord.Client();
client.on("ready", () => {
	console.log("I am ready!");
});



var imgClient = new GoogleImages(codes.CSE, codes.API);


// large functions

function ytEmbed(video) {
	console.log('Making YT embed')
	return {
		"title": video.title,
		"color": 38232,
		"thumbnail": {
			"url": `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`,
		},
		"author": {
			"name": video.channelTitle,
			"icon_url": "https://cdn1.iconfinder.com/data/icons/logotypes/32/youtube-512.png"
		},
		"fields": [
		  {
			"name": video.link,
			"value": video.description,
		  }
		]
	}
}



function imageEmbed(url) {
	console.log('Making Image embed')
	var embed =  {
		color: 38232,
		image: {
			url: url
		}
	}

	// if(censor) {
	// 	download.image({url: embed.image.url, dest: './stupid_images'})
	// 	.then( ({filename, image} ) => {
	// 		nudity.scanFile(filename, function(err, result) {
	// 		  if(result) {
	// 			embed.image.url = 'https://img.tineye.com/result/e0815bc33ef0ea7f96f683e2858108dbe0f1236af0b02703c72046046bc12acd?size=160'
	// 			embed.fields = [
	// 			{"name":"I thought this was TOO sexy", "value":url}
	// 			]
	// 		  }

	// 		  console.log(latestEmbeds);
	// 		  resolve(embed);
	// 		});
	// 	})
	// 	.catch((e) => {
	// 		console.log(e);
	// 		return(embed);
	// 	});
	// } else {
	return(embed);
	// };
}

function gif(args, message) {
	gifSearch.query(args).then((gifUrl) => {
		var embed = imageEmbed(gifUrl);
		message.channel.send({embed});
		trackStat('gifs', message.author);
	})
}

function youtubeSearch(args, message) {
	ytSearch(args, ytOpts, function(err, results) {
		if(err) return console.log(err);

		var embed = ytEmbed(results[0])
		message.channel.send({embed}).then((msg) => {
			updateGlobalScroll(results.map((vid) => {return ytEmbed(vid)}), msg)
		});
	});
}

function urbanSearch(message, args) {
	var pos = posEmojis[Math.floor(Math.random() * posEmojis.length)];
	var neg = negEmojis[Math.floor(Math.random() * negEmojis.length)];

	urban(args).then((urb) => {
		var embed = {
			"author": {
				"name": `Jurban Dictionary: ${urb.word}`
			},
			"color": 38232,
			"fields": [
				{
					"name": "Definition",
					"value": `${urb.definition}`
				},

				{
					"name": "Example",
					"value": `${urb.example}`
				},

				{
					"name": `${pos} Upvotes`,
					"value": `${urb.thumbsUp}`,
					"inline": true,
				},

				{
					"name": `${neg} Downvotes`,
					"value": `${urb.thumbsDown}`,
					"inline": true,
				}
			]
		}

		if(urb.sounds) {
			embed.author.name += ` [listen 🔉](${urb.sounds[0]})`
		}
		trackStat("urban", message.author);
		message.channel.send({embed});
	})
	.catch((e) => {
		message.channel.send(`not found sorry`)
	})
}

async function search(args, message) {
	var first;
	var pos = posEmojis[Math.floor(Math.random() * posEmojis.length)];
	var neg = negEmojis[Math.floor(Math.random() * negEmojis.length)];

	var embed = await imageEmbed("https://img.tineye.com/result/e0815bc33ef0ea7f96f683e2858108dbe0f1236af0b02703c72046046bc12acd?size=160");

	lastSearch = args;

	imgClient.search(args, {safe: 'off'})
	.then( async (images) => { 
		if(images.length == 0) {
			console.log('no results found...')
			message.channel.send('no results found...')
			return;
		}
		console.log(images.length);
		first = images[0];
		
		if(wordFilter && args.split(' ').some((e) => {return killList.includes(e)})) {  
			// warn tree
			trackStat("warned", message.author);
			var warn;
			var success;
			embed.description = "Whoa there, fucko! Who the fuck do you think you are? Should I show these results?"
			message.channel.send({embed}).then(msg => warn = msg);

			message.react(pos).then(() => message.react(neg));
			const collector = message.createReactionCollector((reaction, user) => [pos, neg].includes(reaction.emoji.name), { time: 15000 });
			collector.on('collect', async (r) => {
				console.log(r.users.size);
				if(r.emoji.name === pos && r.users.size == 3) {
					delete embed.description;
					success = true;
					warn.edit('`just a moment`')
					warn.edit({"embed":null});
					updateGlobalScroll(images.map(async (img) => {return await imageEmbed(img.url)}), warn)
					Promise.all(latestEmbeds).then((vs) => { 
						latestEmbeds[0].then((latestEmbed) => {
							warn.edit({"embed":latestEmbed});
							console.log(latestEmbeds);
						});
					});
					collector.stop();

				} else if(r.emoji.name === neg && r.users.size == 2) {
					trackStat("executed", message.author);
					warn.delete(2);
					collector.stop();
				}
			})

			collector.on('end', (collected) => {
				if(!success) {
					trackStat("executed", message.author);
					warn.delete(2);
				};
			});

		} else {
			// no warn tree
			message.channel.send("`just a moment...`").then(async (msg) => {
				updateGlobalScroll(images.map(async (img) => {return await imageEmbed(img.url)}), msg);
					Promise.all(latestEmbeds).then((vs) => { 
					latestEmbeds[0].then((latestEmbed) => {
						msg.edit({"embed":latestEmbed});
						console.log(latestEmbeds);
					});
				});
			});
		};

		
	});
}

function updateGlobalScroll(embeds, message) {
	console.log('updating global scroll')
	latestEmbeds = embeds;
	embedIndex = 0;
	latestEmbedMessage = message;
}


function quote(msg, ask) {
	
	var author = msg.author;
	if(ask.author = author) {
		trackStat("selfquote", ask.author);
	}
	
	var authId = `${author.id}`;
	var embed = {
		"description": "anyone else in this chatroom enjoy slurping on some delicious toes? no? mmhj.... hmm.. just me... a...",
		"color": 6482943,
		"thumbnail": {
			"url": "https://media.discordapp.net/attachments/348636325471059978/514654174491836416/Untitled1.png"
		},
	}

	embed.description = msg.content;
	embed.author = {
		"name": author.username,
		"icon_url": author.avatarURL
	}

	if(msg.attachments.size >= 1) {    
		embed.image = {
			"url": msg.attachments.first().url
		}
	}

	if(msg.embeds.length >= 1) {
		embed = msg.embeds[0];
		embed.author = {
			"name": msg.author.username,
			"icon_url": msg.author.avatarURL
		};
	};

	console.log('Made an embed');
	
	trackStat("quoted", msg.author);
	msg.channel.send("Here's the quote.", {embed});

	return {"embed":embed};
}



function multiTranslate(string, message) {
	translate(string, {to: 'japanese'}).then(res => {
		translate(res.text, {to: 'german'}).then(res => {
			translate(res.text, {to: 'english'}).then(res => {
				message.channel.send(`*${message.author.username}:* ${res.text}`);
			}).catch(err => {
				message.channel.send(`i am error \n ${err}`);
			})
		}).catch(err => {
			message.channel.send(`i am error \n ${err}`);
		})
	}).catch(err => {
		message.channel.send(`i am error \n ${err}`);
	})
}

function googler(args, message) {
	google(args, function (err, res) {
		if(err) {
			console.log("ERROR")
			console.log(err);
		}

		if(res) {
			console.log("res here");
		} else {
			console.log("no res");
		}

		message.channel.send({embed: googleEmbed(res)});
	})
}

function googleEmbed(res) {
	console.log(`${res.links.length} links returned`)
	var embed = {
		title: `here's google for ${res.query}`,
		fields: [],
		color: 38232,
	}

	for(var i=0; i<7; i++) {
		var link = res.links[i]
		if(link == undefined || link.href == null || link.title == '') {
			console.log(link)
		} else {

			console.log(link);
			embed.fields.push({name: `\n${link.title}`, value: `${link.description.substring(0, 120)}...\n[Read More!](${link.href})`, inline: true})
		}
	}

	return embed;
}



function trackStat(stat, author, value = 1) {
	if(!total[stat]) {
		total[stat] = {};
	}
	
	if(!total[stat][author.id]) {
		total[stat][author.id] = 0;
	}
	total[stat][author.id] = total[stat][author.id] + value;
	
	json.writeFileSync('./total.json', total);
}

function leaders(stat) {
	var leaders = [];

	for(var i=0; i<Object.keys(total[stat]).length; i++) {
		var userID = Object.keys(total[stat])[i];
		// var user = message.guild.members.find(u => u.id == userID);

		leaders.push({u: userID, v: total[stat][userID]});
	}
	
	leaders.sort(function(a, b){return b.v-a.v});
	console.log(leaders);
	return leaders;
}

function getKings() {
	var kings = {};
	var retKings = [];

	for(var t=0;t<Object.keys(titles).length; t++) {
		var title = Object.keys(titles)[t];
		if(total[title]) {
			var leader = leaders(title)[0];

			if(!kings[leader.u]) {
				kings[leader.u] = 0;
			}
			kings[leader.u] += 1;
		}
	}
	

	for(var k=0;k<Object.keys(kings).length; k++) {
		var king = Object.keys(kings)[k];
		retKings.push({u: king, v: kings[king]});
	}


	retKings.sort(function(a, b){return b.v-a.v});
	return retKings;
}


client.on("message", message => {
	if(message.author.id === client.user.id) return;

	var command = message.content.toLowerCase().substring(prefix.length).split(' ')[0];
	var args = message.content.toLowerCase().substring(prefix.length + command.length + 1).toLowerCase();  
	var archiveChannel;
	var DM = false;

	if(message.guild === null) {
		DM = true;
		console.log(`From "${message.author.username}"`);
	} else {
		console.log(`From "${message.guild.name}"`);
		archiveChannel = message.guild.channels.find((channel) => channel.name.toLowerCase().includes("archive"));
	}

	if(message.content.includes('!catch')) {
		trackStat("pokemon", message.author);
	}

	if(message.content.includes('g*play')) {
		trackStat("gamer", message.author);
	}

	if(message.content.includes('g*slots')) {
		trackStat("gambler", message.author);
	}

	trackStat("messager", message.author);
	

	if(message.content.toLowerCase().substring(0, prefix.length) != prefix) {
		if(subtitles) {		
			translate(message.content, {to: lang}).then(res => {
				if(res.text != '') {
					if(brokenSubtitles) {
						// it's time to go even further beyond
						multiTranslate(res.text, message)
					} else {
						// just send normal translation
						message.channel.send(`*${message.author.username}:* ${res.text}`);
					}
				}
			}).catch(err => {
				message.channel.send(`i am error \n ${err}`);
				console.log(err);
			});
		}
		return;
	}

	if( (command == 'b' || command == 'n') && (latestEmbeds == [])) {
		message.channel.send('nothing to scroll : (');
		return;
	}

	if(command == 'ql' || command == "quotel" || command == "quotelatest") {
		var messages = message.channel.messages.array().reverse();
		messages.shift();
		var searchedMsg = messages[0];

		if(message.mentions.members.first() != undefined) {
			console.log('specified user');
			var user = message.mentions.members.first().user;
			searchedMsg = messages.find((m) => m.author == user);
		}


		if(searchedMsg != undefined && searchedMsg.content != message.content) {
			trackStat("quoting", message.author);
			archiveChannel.send(quote(searchedMsg, message));
		};
	}

	if(command == 'qs' || command == "quotes") {
		var messages = message.channel.messages.array().reverse();
		messages.shift();
		var searchedMsg = messages.find((msg) => msg.content.toLowerCase().includes(args));
		if(searchedMsg != undefined && searchedMsg.content != message.content) {
			archiveChannel.send(quote(searchedMsg, message));
		};
	}

	if(command == 'qid' || command == "quoteid") {
		message.channel.fetchMessage(args)
			.then((fetched) => {
				if(archiveChannel != undefined && fetched != undefined && fetched.content != message.content) {
					archiveChannel.send(quote(fetched, message));
				}
			})
			.catch((error) => {
				console.log(error);
				message.channel.send('Invalid message ID.')
		});
	}

	if(command == 'phrase' || command == 'p') {
		total[message.author] = args;
		message.channel.send(`ok, your phrase is now ${args}`);
	}

	if(command == 'leaderboard' || command == 'l') {
		console.log(args)
		if(args == '') {
			var embed = {
				"description": `available leaderboards:`,
				"color": 16772150,
				"fields": [
				],
			}

			for(var t=0;t<Object.keys(titles).length;t++) {
				var title = Object.keys(titles)[t];
				if(!total[title]) {
					embed.fields.push({
						"name": title,
						"value": "none recorded",
						"inline": true,
					})
				} else {
					embed.fields.push({
						"name": title,
						"value": `${desc[title]}`,
						"inline": true,
					})
				}
			}

			message.channel.send({embed});
			return;
		} else if(!total[args]) {
			message.channel.send(`sorry, i couldn't find that stat.`);
			return;
		}


		var leads = leaders(args);
		var embed = {
			"description": `the current ${args} leader is <@${leads[0].u}> 🎉 \n _(${desc[args].toLowerCase()})_\n\n`,
			"color": 16772150,
			"fields": [
				{"name": "_ _", "value": "_ _"}
			]
		}

		console.log(total[`<@${leads[0].u}>`]);


		for(var x=0; x<leads.length;x++) {
			var inlineembed = {
				"name": `_ _`,
				"value": `<@${leads[x].u}>`,
			}

			if(showValues[args]) {
				inlineembed.value += ` ${leads[x].v} ${showValues[args]}`;
			}

			if(total[`<@${leads[x].u}>`] != undefined) {
				inlineembed.value += `\n"${total[`<@${leads[x].u}>`]}"\n`;
			}

			if(x <= titles[args].length-1) {
				inlineembed.name = `${titles[args][x]}`
				embed.fields.push(inlineembed);
			} else if(showFull[args]) {
				inlineembed["inline"] = true;
				embed.fields.push(inlineembed);
			}


		};
		

		message.channel.send({embed})
	}

	if(command == 'kings') {
		var kings = getKings();
		var embed = {
			"description": `the one who tops the most leaderboards is is <@${kings[0].u}>.`,
			"color": 16772150,
			"fields": [
			]
		}

		for(var x=0; x<kings.length;x++) {
			var inlineembed = {
				"name": `_ _`,
				"value": `<@${kings[x].u}>`,
			}
			console.log(x);
			if(x <= king.length-1) {
				inlineembed.name = `${king[x]}`
				embed.fields.push(inlineembed);
			}
		};
		

		message.channel.send({embed})

	}

	if(command == 's' || command == 'search') {
		trackStat("searched", message.author);
		search(args, message)
	}

	if(command == 'gs' || command == 'googlesearch') {
		console.log('hi');
		googler(args, message);
	}

	if(command == 'ys' || command == 'ysearch') {
		trackStat("youtubed", message.author);
		youtubeSearch(args, message)
	}

	if(command == 'n' || command == 'next') {
		console.log(latestEmbeds);

		if(embedIndex+1 == latestEmbeds.length) {
			message.channel.send('too far up dummy')
		} else {
			embedIndex+=1
			latestEmbeds[embedIndex].then((nextEmbed) => {
				nextEmbed.description = `${embedIndex+1} / ${latestEmbeds.length}`;
				probe(nextEmbed.image.url, function(err, result) {
					console.log(result);
					if(result != undefined) {
						trackStat('distance', message.author, result.height * 0.0002645833);
					}
				});
				latestEmbedMessage.edit({"embed": nextEmbed})
				message.delete(2);
			})
		}
	}


	if(command == 'b' || command == 'back') {
		if(embedIndex-1 <= -1) {
			message.channel.send('too far down, ok?')
			return;
		} else {
			embedIndex-=1
			latestEmbeds[embedIndex].then((nextEmbed) => {
				nextEmbed.description = `${embedIndex+1} / ${latestEmbeds.length}`;
				probe(nextEmbed.image.url, function(err, result) {
					if(result != undefined) {
						trackStat('distance', message.author, result.height * 0.0002645833);
					}				
				});
				latestEmbedMessage.edit({"embed": nextEmbed})
				message.delete(2);
			});
		}
	}

	if(command == 'me' || command == 'm') {
		trackStat("me", message.author);
		message.channel.send(`*${message.author.username}:* _${args}_`).then((res) => {
			message.delete(5);
		});
	}

	if(command == 'subtitles') {
		subtitles = !subtitles;
		message.channel.send(`ok, subtitles is ${subtitles}`)
	}

	if(command == 'lang') {
		message.channel.send(`ok, lang was ${lang} now ${args}`);
		lang = args;
	}

	if(command == 'brokensubtitles') {
		brokenSubtitles = !brokenSubtitles;
		message.channel.send(`ok, breaking is ${brokenSubtitles}`);
	}

	if(command == 'post') {
		twitter.post('statuses/update', {status: `💖💞${args}💞💖`})
	}

	if(command == 'wordfilter') {
		wordFilter = !wordFilter;
		message.channel.send(`ok, wordfilter is ${wordFilter}`)
	}

	if(command == 'urban') {
		urbanSearch(message, args);
	}

	if(command == 'gif') {
		gif(args, message);
	}
});

setInterval(function() { updater.post(
	{
		"status": 'online',
		"last-search": lastSearch,
	}
	).catch((e)=>{console.log('Site offline or invalid URL.')})}, 1000 * 10);

client.login(codes.token);
const RPC = require('discord-rich-presence')("187406016902594560");



RPC.on('join', (secret) => {
  console.log('we should join with', secret);
});

RPC.on('spectate', (secret) => {
  console.log('we should spectate with', secret);
});

RPC.on('joinRequest', (user) => {
  if (user.discriminator === '1337') {
    client.reply(user, 'YES');
  } else {
    client.reply(user, 'IGNORE');
  }
});

RPC.on('connected', () => {
  console.log('connected!');

  RPC.updatePresence({
    state: 'slithering',
    details: '🐍',
    startTimestamp: new Date(),
    largeImageKey: 'snek_large',
    smallImageKey: 'snek_small',
    partyId: 'snek_party',
    partySize: 1,
    partyMax: 1,
    matchSecret: 'slithers',
    joinSecret: 'boop',
    spectateSecret: 'sniff',
  });
});

// cl