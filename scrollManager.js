module.exports = class scroll {

	constructor() {
		this.globalScrollUpdateMessage = null;
		this.globalScrollEmbeds = [];
		this.globalScrollIndex = 0;
		this.messagesSinceScrollUpdate = 0;
	}

	setGlobalScrollEmbeds(title, items, embedFunction, c=10) {
		this.globalScrollEmbeds = [];
		this.globalScrollIndex = 0;

		if(c >= items.length) {
			c = items.length;
		};

		for(var i=0;i<c;i++) {
			this.globalScrollEmbeds.push(embedFunction(items[i], this.getIndexIndicator(title, i, c)));
		};

		console.log(`${this.globalScrollEmbeds.length} embeds added to global scroll.`);
	};

	setGlobalScrollIndex(i) {
		i = i-1
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
	}

	getIndexIndicator(title, i, cap) {
		return(`${title} ${i+1} / ${cap}`);
	}

}
