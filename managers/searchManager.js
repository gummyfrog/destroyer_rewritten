/* jshint esversion:6*/

const GoogleImages = require('google-images');
const Necessary = require('./necessary.js');
const axios = require('axios');


module.exports = class search extends Necessary {

	constructor() {
		super();
		this.imgClient = new GoogleImages(this.codes.CSE, this.codes.GAPI);
		this.giphy = require('giphy-api')(this.codes.GIPHY);
		this.gapi = this.codes.GAPI;
		this.youtubeSearch = require('youtube-search-promise');
		this.yt_opts = {
			maxResults: 8,
			key: this.codes.GAPI,
		};

	}

	imageSearch(message, args, scroll) {	
		if(args == "") return;
		this.imgClient.search(args, {page: 1})
		.then((images) => {
			if(images.length == 0) {
				message.channel.send(this.embeds.alert("No results found."));
				return;
			}

			images = images.map(img => {return {url: img.url, link: img.parentPage};});
			
			this.dlog(images);

			scroll.setGlobalScrollEmbeds(args, images, this.embeds.image, 20);
			// make this a setting!

			message.channel.send(scroll.createMessage()).then((sentMessage) => {
				scroll.globalScrollUpdateMessage = sentMessage;
				scroll.makeButtonHandler();
			});

			// send stitch embed

		})
		.catch((err) => this.errorHandler(err, message));
	}

	ytSearch(message, args, scroll) {
		this.youtubeSearch(args, this.yt_opts)
		.then((res) => {
			if(res.length == 0) {
				message.channel.send(this.embeds.alert("No results found."));
				return;
			}
			res = res.map(obj => {if(obj.kind == "youtube#video") return obj;});
			res = res.filter((e) => {
				return e != undefined;
			});
			scroll.setGlobalScrollEmbeds(args, res, this.embeds.video, 20);
			message.channel.send(scroll.createMessage()).then((sentMessage) => {
				scroll.globalScrollUpdateMessage = sentMessage;
				scroll.makeButtonHandler();

			});
		})
		.catch((err) => this.errorHandler(err, message));
	}	

	giphySearch(message, args, scroll) {
		if(args==null) return;
		this.giphy.search(args)
		.then((res) => {
			if(res.data.length == 0) {
				message.channel.send(this.embeds.alert("No results found."));
				return;
			}

			res = res.data.map(obj => {return obj.images.original.url;});

			scroll.setGlobalScrollEmbeds(args, res, this.embeds.gif, 20);
			message.channel.send(scroll.createMessage()).then((sentMessage) => {
				scroll.globalScrollUpdateMessage = sentMessage;
				scroll.makeButtonHandler();
			});
		})
		.catch((err) => this.errorHandler(err, message));
	}
};
