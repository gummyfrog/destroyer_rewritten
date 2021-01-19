/* jshint esversion:6*/

const GoogleImages = require('google-images');
const Necessary = require('./necessary.js');
const axios = require('axios');
const puppeteer = require('puppeteer');


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

			images = images.map(img => {return {url: img.url, link: img.parentPage}});
			
			this.dlog(images);

			scroll.setGlobalScrollEmbeds(args, images, this.embeds.image, 20);
			// make this a setting!
			message.channel.send(scroll.globalScrollEmbeds[0]).then((sentMessage) => {
				scroll.globalScrollUpdateMessage = sentMessage;
			});
		})
		.catch((err) => this.errorHandler(err, message));
	}

	// async imageScrape(message, args, scroll) {
	// 	this.dlog("Let's scrape!");
	// 	if(args == "") return;
	// 	var browser = await puppeteer.launch();
	// 	var page = await browser.newPage();
	// 	await page.goto(`https://www.google.com/search?q=${args}&sxsrf=ALeKk02lVLqPSRR3wyL38GgKZXFmVDYmAQ:1605706170777&source=lnms&tbm=isch&sa=X&ved=2ahUKEwivzrDPmYztAhVBnFkKHVPhCX8Q_AUoAXoECCEQAw&biw=1070&bih=801&dpr=2`); 
	// 	await page.screenshot({path: 'example.png'});

	// 	var greatImages = await page.evaluate(async ()=> {
	// 		var imageNodeList = document.querySelectorAll('img.Q4LuWd');
	// 		var imageArray = [];

	// 		for(var x=0;x<1;x++) {
	// 			await imageNodeList[x].click();

	// 			var realImages = document.querySelectorAll('img.n3VNCb');

	// 			for(var y=0;y<realImages.length;y++) {
	// 				if(realImages[y] != null) {
	// 					imageArray[x] = realImages[y].get_attribute("src");
	// 				}
	// 			}
	// 		}
			
	// 		return imageArray;

	// 	});

	// 	await page.screenshot({path: 'clicked.png'});


	// 	console.log(greatImages);
	// 	message.channel.send(`\`${greatImages}\``);

	// 	await browser.close();
	// }

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

			res = res.data.map(obj => {return obj.images.original.url})

			scroll.setGlobalScrollEmbeds(args, res, this.embeds.gif, 20)
			message.channel.send(scroll.globalScrollEmbeds[0]).then((sentMessage) => {
				scroll.globalScrollUpdateMessage = sentMessage
			});
		})
		.catch((err) => this.errorHandler(err, message))
	}

	googleSearch(message, args, scroll) {
		var url = (`https://www.googleapis.com/customsearch/v1?cx=destroyer-additional-search?key=${this.gapi}&q=${args}`)
		axios.get(url)
		.then((res) => {
			message.channel.send(res);
		}) 
		.catch((err) => this.errorHandler(err, message))
	}
}
