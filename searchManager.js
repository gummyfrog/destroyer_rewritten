var GoogleImages = require('google-images');
var Necessary = require('./necessary.js')

module.exports = class search extends Necessary {

	constructor() {
		super();
		this.imgClient = new GoogleImages(this.codes.CSE, this.codes.API);
		this.giphy = require('giphy-api')(this.codes.GIPHY)
		this.youtubeSearch = require('youtube-search-promise');
		this.google = require('google')
		this.google.resultsPerPage = 5;
		this.yt_opts = {
			maxResults: 8,
			key: this.codes.YT,
		};

	}

	imageSearch(message, args, scroll) {	
		this.imgClient.search(args, {page: 1})
		.then((images) => {
			if(images.length == 0) {
				message.channel.send(this.embeds.alert("No results found."))
				return;
			}

			images = images.map(img => {return img.url});
			
			scroll.setGlobalScrollEmbeds(args, images, this.embeds.image, 20) // make this a setting!
			message.channel.send(scroll.globalScrollEmbeds[0]).then((sentMessage) => {
				scroll.globalScrollUpdateMessage = sentMessage;
			});
		})
		.catch((err) => this.errorHandler(err))
	}

	ytSearch(message, args, scroll) {
		this.youtubeSearch(args, this.yt_opts)
		.then((res) => {
			if(res.length == 0) {
				message.channel.send(this.embeds.alert("No results found."))
				return;
			}
			res = res.map(obj => {if(obj.kind == "youtube#video") return obj});
			res = res.filter((e) => {
				return e != undefined;
			});
			scroll.setGlobalScrollEmbeds(args, res, this.embeds.video, 20)
			message.channel.send(scroll.globalScrollEmbeds[0]).then((sentMessage) => {
				scroll.globalScrollUpdateMessage = sentMessage
			});
		})
		.catch((err) => this.errorHandler(err))
	}	


	giphySearch(message, args, scroll) {
		console.log(args);
		this.giphy.search(args)
		.then((res) => {
			if(res.length == 0) {
				message.channel.send(this.embeds.alert("No results found."))
				return;
			}

			console.log(res.data[0]);
			res = res.data.map(obj => {return obj.images.original.url})

			scroll.setGlobalScrollEmbeds(args, res, this.embeds.image, 20)
			message.channel.send(scroll.globalScrollEmbeds[0]).then((sentMessage) => {
				scroll.globalScrollUpdateMessage = sentMessage
			});
		})
		.catch((err) => this.errorHandler(err))
	}

	// googleSearch(message, args) {
	// 	var nextCounter = 0;

	// 	this.google(args, (err, res) => {
	// 		if(err) this.errorHandler(err);

	// 		console.log(Object.keys(res));
	// 		console.log(res.links.length);
	// 		console.log(res.links)

	// 		for(var i=0; i < res.links.length; i++) {
	// 			var link = res.links[i];
	// 			console.log(link.title + ' - ' + link.href)
	// 			console.log(link.description + "\n")
	// 		}

	// 		if(nextCounter < 4) {
	// 			nextCounter+= 1
	// 			if(res.next) res.next()
	// 		}
	// 	})
	// }

}
