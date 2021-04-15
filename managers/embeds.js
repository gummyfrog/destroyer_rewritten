/* jshint esversion:6*/

module.exports = class embeds {

	constructor(opt = {}) {
		this.colors = {};
		this.refresh(opt);
		this.reference = this.reference.bind(this);
		this.image = this.image.bind(this);
		this.gif = this.gif.bind(this);
		this.video = this.video.bind(this);

		if(process.env.DEBUG) {
			this.monocolor(16728663);
		}
	}
	
	refresh(config) {
		this.colors = Object.assign({
			leaderboard: 16763981, // #ffcc4d
			list: 8640595, // #83d853
			video: 13632027, // #D0021B
			image: 14707627, // #E06BAB
			warn: 16728663, // #B52F49
			reference: 10526880, // #7FA864
		}, config);
	}

	monocolor(color) {
		for(var k=0; k<Object.keys(this.colors).length;k++) {
			var key = Object.keys(this.colors)[k];
			this.colors[key] = color;
		}
	} 

	// used as base to construct other embeds
	objLoop(object, exclude = []) {
		var ret = "";
		for(var i=0;i<Object.keys(object).length;i++) {
			var key = Object.keys(object)[i];
			if(!exclude.includes(key)) {
				var value = object[key];

				if(typeof(value) == "object") {
					// implement redundancy for trees?
					value = `Sub-Object with ${Object.keys(object[key]).length} keys.`;
				}

				ret += (`**${key}**: ${value}\n`);
			}
		}

		return ret;
	}

	arrayLoop(array) {
		var ret = "";
		for(var i=0;i<array.length;i++) {
			var value = array[i];
			if(typeof(value) == "object") {
				// implement redundancy for trees?
				value = `Sub-Object with ${Object.keys(object[key]).length} keys.`;
			}

			ret += (value + ', ');
		}

		return ret;
	}

	arbitraryObjectDisplay(object, exclude = []) { 
		var embed = {
			color: this.colors.list,
			fields: [],
		};

		for(var i=0;i<Object.keys(object).length;i++) {
			var key = Object.keys(object)[i];
			var value = object[key];

			if(typeof(value) == "object") {
				if (value.constructor === Array) {
					value = this.arrayLoop(value);
				} else {
					value = this.objLoop(value, exclude);
				}
			}

			embed.fields.push({
				name: key,
				value: value
			});
		}

		// returns only normal embed.

		console.log(embed);
		return embed;
	}


	// used lazy binding for these :( fix later

	// quote(msg) {
	// 	var filename = msg.author.avatarURL.substring(0, msg.author.avatarURL.indexOf('?')).replace(/\D/g,'');
	// 	var author = msg.author;
	// 	var authId = `${author.id}`;
	// 	var embed = {
	// 		description:  msg.content,
	// 		color: this.colors.quote,
	// 		thumbnail: {
	// 			url: "https://media.discordapp.net/attachments/348636325471059978/514654174491836416/Untitled1.png"
	// 		},
	// 		author: {
	// 			name: author.username,
	// 			icon_url: `http://frogeye.duckdns.org:8282/images/${filename}.png`
	// 		},
	// 	};

	// 	if(msg.attachments.size >= 1) {    
	// 		embed.image = {
	// 			url: msg.attachments.first().url
	// 		};
	// 	}

	// 	if(msg.embeds.length >= 1) {
	// 		embed = msg.embeds[0];
	// 	}

	// 	return({"embed":embed});
	// }


	reference(msg) {
		var filename = msg.author.avatarURL.substring(0, msg.author.avatarURL.indexOf('?')).replace(/\D/g,'');
		var author = msg.author;
		var authId = `${author.id}`;
		var embed = {
			description: msg.content,
			color: this.colors.reference,
			author: {
				name: author.username,
				icon_url: `http://frogeye.duckdns.org:8282/images/${filename}.png`
			},
			footer: {
				text: `${msg.createdAt.toLocaleTimeString()}`
			}
		};

		if(msg.attachments.size >= 1) {    
			embed.image = {
				url: msg.attachments.first().url
			};
		}

		if(msg.embeds.length >= 1) {
			embed = msg.embeds[0];
		}

		return({"embed":embed});
	}



	image(info, indexIndicator = "") {
		var embed = {
			title: indexIndicator,
			color: this.colors.image,
			image: {
				url: info.url
			},
			footer: {
				text: `👀 ${info.link}`
			}
		};

		return({"embed":embed});
	}

	gif(url, indexIndicator = "") {
		var embed = {
			title: indexIndicator,
			color: this.colors.image,
			image: {
				url: url
			}
		};

		return({"embed":embed});
	}

	video(data, indexIndicator = "") {
		var embed = {
			title: `${data.title} ${indexIndicator}`,
			color: this.colors.video,
			author: {
				name: data.channelTitle,
				icon_url: "https://cdn1.iconfinder.com/data/icons/logotypes/32/youtube-512.png",
			},
			thumbnail: {
				url: `https://img.youtube.com/vi/${data.id}/maxresdefault.jpg`,
			},
			fields: [{
				name: data.link,
				value: data.description || "...",
			}]
		};

		return({"embed":embed});
	}

	// no binding required

	prophecy(msg) {
		var embed = {
			title: "🔮✨",
			description: `${msg}`,
			color: this.colors.video
		};

		return({"embed":embed});
	}


	leaderboard(name, stat) {
		console.log(stat);
		var embed = {
			title: name,
			description: stat.desc,
			color: this.colors.leaderboard,
			thumbnail: {
				url : "https://www.shareicon.net/download/2016/07/27/802814_miscellaneous_512x512.png"
			},
			fields:[],
		};

		// i am a jankaholic

		var c = 0;
		var sorted = Object.keys(stat.data).sort((b,a) => {
			return stat.data[a]-stat.data[b];
		});

		embed.fields = Object.keys(sorted).map((key) => {
			console.log(stat.data);
			console.log(key);
			var field = {
				name: "_ _",
				value: `${sorted[key]} at ${stat.data[sorted[key]]}!!`
			};

			if(stat.titles[c] != undefined) {
				field.name = stat.titles[c];
			}

			c+=1;

			return field;
		});

		return({"embed":embed});
	}

	vote() {
		var embed = {
			title: "🛑✋ Whoa, there!",
			description: "I'm not just gonna let you do that, motherfucker. What say you?",
			color: this.colors.warn,
		};

		return({"embed":embed});
	}

	cancelledVote(count) {
		var embed = {
			title: "⚠️✋ Well, there's always next time.",
			description: "It was probably a bad search anyway.",
			fields: [
			{
				name: "Fun Fact #17",
				value: `This is the (${count})-th-st cancelled vote.`
			}
			],
			color: this.colors.leaderboard,
		};

		return({"embed":embed});
	}


	alert(msg) {
		var embed = {
			title: "⚠️✋",
			description: msg,
			color: this.colors.leaderboard
		};

		return({"embed":embed});
	}

	error(msg) {
		var embed = {
			title: "🛑✋",
			description: `**${msg}**`,
			color: this.colors.warn
		};

		return({"embed":embed});
	}

	translation(original, res) {
		var embed = {
			title: `${original}`,
			description: `**⮑ ${res}**`,
			color: this.colors.list
		};

		return({"embed":embed});
	}

	config(configObject) {
		console.log(configObject);
		var embed = this.arbitraryObjectDisplay(configObject);
		embed.title = "Config";
		return({"embed":embed});
	}

	help(helpObject) {
		var embed = this.arbitraryObjectDisplay(helpObject);
		embed.title = "Jordan 2.0b Help Menu";
		embed.inline = true;
		return({"embed":embed});
	}

	status(statusObject) {
		console.log(statusObject);
		var embed = this.arbitraryObjectDisplay(statusObject, ["status", "last", "last-search"]);
		embed.title = "What's Up?";
		return({"embed":embed});
	}

	leaderboardList(statsObject) {
		var embed = this.arbitraryObjectDisplay(statsObject, ["titles", "data"]);
		embed.title = "Tracked Stats";
		return({"embed":embed});
	}

};

