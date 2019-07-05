module.exports = {
	name: 'Gif Search',
	description: 'Searches for a gif.',
	key: 'gif',
	blacklisted: true,
	required: ["searcher", "scroll"],
	execute(message, args, managers = {}) {
		managers.searcher.giphySearch(message, args, managers.scroll);
	},
};

