var GoogleImages = require('google-images');
var Necessary = require('./necessary.js');
var axios = require('axios');

module.exports = class search extends Necessary {

	constructor() {
		super();
		this.imgClient = new GoogleImages(this.codes.CSE, this.codes.API);
		this.giphy = require('giphy-api')(this.codes.GIPHY)
		this.gapi = this.codes.GAPI
		this.youtubeSearch = require('youtube-search-promise');
		this.yt_opts = {
			maxResults: 8,
			key: this.codes.YT,
		};
	}

	imageSearch(message, args, scroll) {	
		if(args == "") return;
		this.imgClient.search(args, {page: 1})
		.then((images) => {
			if(images.length == 0) {
				message.channel.send(this.embeds.alert("No results found."))
				return;
			}

			images = images.map(img => {return img.url});
			
			scroll.setGlobalScrollEmbeds(args, images, this.embeds.image, 20) // make this a setting!
			message.channel.send(scroll.globalScrollEmbeds[0]).then((sentMessage) => {
				console.log(sentMessage);
				scroll.globalScrollUpdateMessage = sentMessage;
			});
		})
		.catch((err) => this.errorHandler(err, sentMessage))
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
		.catch((err) => this.errorHandler(err, message))
	}	


	giphySearch(message, args, scroll) {
		if(args==null) return;
		this.giphy.search(args)
		.then((res) => {
			if(res.data.length == 0) {
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
		.catch((err) => this.errorHandler(err, message))
	}

	googleSearch(message, args, scroll) {
		var url = (`https://www.googleapis.com/customsearch/v1?cx=destroyer-additional-search?key=${this.gapi}&q=${args}`)
		console.log(url);
		axios.get(url)
		.then((res) => {
			console.log(res);
			message.channel.send(res);
		}) 
		.catch((err) => this.errorHandler(err, message))
	}

}
