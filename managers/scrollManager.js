/* jshint esversion:8 */

module.exports = class scroll {

	constructor() {
		this.globalScrollUpdateMessage = null;
		this.globalScrollEmbeds = [];
		this.globalScrollIndex = 0;
		this.messagesSinceScrollUpdate = 0;
		this.emojis = ['➡️','⬅️'];
		this.buttons = [{
				"type":1,
				"components": [
				{
					"type":2,
					"label": "Previous",
					"style":1,
					"custom_id": "back"
				},
				{
					"type":2,
					"label": "Next",
					"style":1,
					"custom_id": "next"
				},

				]
			}]
	}

	setGlobalScrollEmbeds(title, items, embedFunction, c=10) {
		this.globalScrollEmbeds = [];
		this.globalScrollIndex = 0;

		if(c >= items.length) {
			c = items.length;
		}

		for(var i=0;i<c;i++) {
			this.globalScrollEmbeds.push(embedFunction(items[i], this.getIndexIndicator(title, i, c)));
		}

		console.log(`${this.globalScrollEmbeds.length} embeds added to global scroll.`);
	}

	setGlobalScrollIndex(i) {
		i = i-1;
		if(this.globalScrollUpdateMessage == null) return;
		// if(i > this.globalScrollEmbeds.length || i < 0) return;

		this.globalScrollIndex = i;
		this.globalScrollUpdateMessage.edit(this.globalScrollEmbeds[this.globalScrollIndex % this.globalScrollEmbeds.length]);
	}

	createMessage() {
		var message = this.globalScrollEmbeds[0];
		message.components = this.buttons;
		return message;
	}

	getOffsetGlobalScrollIndex(by) {
		if(this.globalScrollUpdateMessage == null) return; // provide a default embed with image
		// if(this.globalScrollIndex+by == -1 || this.globalScrollIndex+by>this.globalScrollEmbeds.length) return;

		this.globalScrollIndex += by;
		// this.globalScrollUpdateMessage.edit(this.globalScrollEmbeds[this.globalScrollIndex]);
		return this.globalScrollEmbeds[this.globalScrollIndex % this.globalScrollEmbeds.length]
	}

	getIndexIndicator(title, i, cap) {
		return(`${title} ${i+1} / ${cap}`);
	}

	// makeReactionHandler() {
	// 	this.globalScrollUpdateMessage.reactions.removeAll();

	// 	this.globalScrollUpdateMessage.react(this.emojis[1]);
	// 	this.globalScrollUpdateMessage.react(this.emojis[0]);

	// 	var filter = (reaction, user) => {	
	// 		return this.emojis.includes(reaction.emoji.name) && user.id != this.globalScrollUpdateMessage.author.id;
	// 	};

	// 	this.globalScrollUpdateMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
	// 	.then(collected => {
	// 		const reaction = collected.first();

	// 		if (reaction.emoji.name == this.emojis[0]) {
	// 			this.getOffsetGlobalScrollIndex(1);
	// 			this.makeReactionHandler();
	// 		} else {
	// 			this.getOffsetGlobalScrollIndex(-1);
	// 			this.makeReactionHandler();
	// 		}

	// 	})
	// 	.catch(err => {
	// 		console.log(err);
	// 		console.log("collector timed out");
	// 	});
	
	// }

	makeButtonHandler() {
		const filter = (interaction) => true;

		var collector = this.globalScrollUpdateMessage.createMessageComponentCollector({filter, time: 120000})

		collector.on("collect", interaction => {
			console.log(interaction);

			// interaction.defer()
			if(interaction.customId == "next") {
				interaction.update(this.getOffsetGlobalScrollIndex(1))
			} else if (interaction.customId == "back") {
				interaction.update(this.getOffsetGlobalScrollIndex(-1));
			}
		})
	
	}


};
