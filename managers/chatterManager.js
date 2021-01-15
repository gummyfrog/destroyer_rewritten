/* jshint esversion:6*/

/*
	unused manager :)
*/

const Necessary = require('./necessary.js');
const json = require('jsonfile');
const fs = require('fs');
const Markov = require('js-markov');

module.exports = class chatter extends Necessary {

	constructor() {
		super();	
		this.conversingStatus = false;
		this.profile_dir = `${process.cwd()}/misc/models`;
		fs.readdirSync(this.profile_dir).filter(file => file.endsWith('.json')).map((file) => {
			var profile = json.readFile(`${this.profile_dir}/${file}`, (err, obj) => {
				if(obj != undefined) {
						this.profiles[obj.name] = {obj};
						console.log(this.profiles);
				}
			});
		});

		this.profiles = {};
	}

	check(message) {
		this.learn(message);

		if(message.content.toLowerCase().includes(["jordan"]) && !this.conversingStatus) {
			this.start(message);
		} else if(message.content.toLowerCase() == "bye jordan" && this.conversingStatus) {
			this.stop(message);
		} else if(this.conversingStatus && Math.random() < 0.2){
			this.respond(message);
		}
	}

	learn(message) {
		var profile = `${this.profile_dir}/${message.author.username}.json`;
		if (fs.existsSync(profile)) {
			console.log(`${profile} exists`);

			var obj = json.readFileSync(profile);
			if(obj != undefined) {
				obj.corpus.push(message.content);
				this.profiles[obj.name] = obj;

				json.writeFileSync(profile, obj);
			}
		} else {
			console.log(`${profile} does not exist.`);
			json.writeFile(profile, {name: message.author.username, corpus:[message.content]}, (err) => {
				if(err) console.log(err);
			});
		}

	}

	respond(message) {
		var the_profiles = Object.keys(this.profiles);
		var random_profile = this.profiles[the_profiles[Math.floor(Math.random() * the_profiles.length)]];
		console.log(random_profile);

		// var markov = new MarkovGen({
		// 	input: random_profile.corpus,
		// 	minLength: 5,
		// });

		// var sentence = markov.makeChain();
		// console.log(sentence);
		var markov = new Markov();	
		markov.addStates(random_profile.corpus);
		markov.train();
		markov.generateRandom();

		message.channel.send(markov.generateRandom());

	}

	start(message) {
		message.channel.send("hiiii");
		this.conversingStatus = true;
	}

	stop(message) {
		message.channel.send("cyaaa");
		this.conversingStatus = false;
	}
};
