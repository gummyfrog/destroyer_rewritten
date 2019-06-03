module.exports = {
	name: 'g',
	description: 'Gif!',
	blacklisted: true,
	required: ["searcher"],
	execute(message, args, managers = {}) {
		managers.searcher.lastMessage = message;
		managers.searcher.giphySearch(args);
	},
};

