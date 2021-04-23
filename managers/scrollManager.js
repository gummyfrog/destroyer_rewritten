/* jshint esversion:8 */

module.exports = class scroll {

	constructor() {
		this.globalScrollUpdateMessage = null;
		this.globalScrollEmbeds = [];
		this.globalScrollIndex = 0;
		this.messagesSinceScrollUpdate = 0;
		this.emojis = ['➡️','⬅️'];
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
		if(i > this.globalScrollEmbeds.length || i < 0) return;

		this.globalScrollIndex = i;
		this.globalScrollUpdateMessage.edit(this.globalScrollEmbeds[this.globalScrollIndex]);
	}

	getOffsetGlobalScrollIndex(by) {
		if(this.globalScrollUpdateMessage == null) return;
		if(this.globalScrollIndex+by == -1 || this.globalScrollIndex+by>this.globalScrollEmbeds.length) return;

		this.globalScrollIndex += by;
		this.globalScrollUpdateMessage.edit(this.globalScrollEmbeds[this.globalScrollIndex]);
		this.makeReactionHandler();
	}

	getIndexIndicator(title, i, cap) {
		return(`${title} ${i+1} / ${cap}`);
	}

	makeReactionHandler() {
		this.globalScrollUpdateMessage.reactions.removeAll();

		this.globalScrollUpdateMessage.react(this.emojis[1]);
		this.globalScrollUpdateMessage.react(this.emojis[0]);

		var filter = (reaction, user) => {
			return this.emojis.includes(reaction.emoji.name) && user.id != this.globalScrollUpdateMessage.author.id;
		};

		this.globalScrollUpdateMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
		.then(collected => {
			const reaction = collected.first();

			if (reaction.emoji.name == this.emojis[0]) {
				this.getOffsetGlobalScrollIndex(1);
				this.makeReactionHandler();
			} else {
				this.getOffsetGlobalScrollIndex(-1);
				this.makeReactionHandler();
			}

		})
		.catch(err => {
			console.log(err);
			console.log("collector timed out");
		});
	
	}

};
