module.exports = {
	name: 'Gif Search',
	description: 'Searches for a gif.',
	key: 'g',
	blacklisted: true,
	required: ["searcher"],
	execute(message, args, managers = {}) {
		managers.searcher.lastMessage = message;
		managers.searcher.giphySearch(args);
	},
};

