var GoogleImages = require('google-images');
var youtubeSearch = require('youtube-search-promise');

module.exports = class searchManager {

	constructor(codes, embeds, err) {
		this.lastMessage = null;	
		this.globalScrollUpdateMessage = null;
		this.globalScrollEmbeds = [];
		this.globalScrollIndex = 0;
		this.lastSearch = "jordan";
		this.messagesSinceScrollUpdate
		this.errHandler = err

		this.yt_opts = {
			maxResults: 8,
			key: codes.YT,
		};

		this.imgClient = new GoogleImages(codes.CSE, codes.API);
		this.giphy = require('giphy-api')(codes.GIPHY)

		this.embeds = embeds;
	}

	setGlobalScrollEmbeds(items, embedFunction, c=10) {
		this.globalScrollEmbeds = [];
		this.globalScrollIndex = 0;

		if(c >= items.length) {
			c = items.length;
		};

		for(var i=0;i<c;i++) {
			this.globalScrollEmbeds.push(embedFunction(items[i], this.getIndexIndicator(i, c)));
		};

		console.log(`${this.globalScrollEmbeds.length} embeds added to global scroll.`);
	};

	getOffsetGlobalScrollIndex(by) {
		if(this.globalScrollUpdateMessage == null) return;
		if(this.globalScrollIndex+by == -1 || this.globalScrollIndex+by>this.globalScrollEmbeds.length) return;

		this.globalScrollIndex += by;
		this.globalScrollUpdateMessage.edit(this.globalScrollEmbeds[this.globalScrollIndex]);
	}

	getIndexIndicator(i, cap) {
		return(`${this.lastSearch} ${i+1} / ${cap}`);
	}


	// big


	search(args) {	
		this.imgClient.search(args, {page: 1})
		.then((images) => {
			if(images.length == 0) {
				this.lastMessage.channel.send(this.embeds.alert("No results found."))
				return;
			}

			images = images.map(img => {return img.url});
			this.lastSearch = args;

			this.setGlobalScrollEmbeds(images, this.embeds.image, 20) // make this a setting!
			this.lastMessage.channel.send(this.globalScrollEmbeds[0]).then((sentMessage) => {
				this.globalScrollUpdateMessage = sentMessage;
			});
		})
		.catch((err) => this.errHandler(err))
	}

	

	ytSearch(args) {
		console.log(args);
		console.log(this.yt_opts);
		youtubeSearch(args, this.yt_opts)
		.then((res) => {
			if(res.length == 0) {
				this.lastMessage.channel.send(this.embeds.alert("No results found."))
				return;
			}
			res = res.map(obj => {if(obj.kind == "youtube#video") return obj});
			res = res.filter((e) => {
				return e != undefined;
			});
			this.lastSearch = args;
			this.setGlobalScrollEmbeds(res, this.embeds.video, 20)
			this.lastMessage.channel.send(this.globalScrollEmbeds[0]).then((sentMessage) => {
				this.globalScrollUpdateMessage = sentMessage
			});


		})
		.catch((err) => this.errHandler(err))

	}	


	giphySearch(args) {
		console.log(args);

		this.giphy.search(args)
		.then((res) => {
			if(res.length == 0) {
				this.lastMessage.channel.send(this.embeds.alert("No results found."))
				return;
			}

			console.log(res.data[0]);
			res = res.data.map(obj => {return obj.images.original.url})

			console.log(res);
			this.lastSearch = args
			this.setGlobalScrollEmbeds(res, this.embeds.image, 20)
			this.lastMessage.channel.send(this.globalScrollEmbeds[0]).then((sentMessage) => {
				this.globalScrollUpdateMessage = sentMessage
			});
		})
		.catch((err) => this.errHandler(err))
	}

}
