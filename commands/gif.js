module.exports = {
	name: 'Gif Search',
	description: 'Searches for a gif.',
	example: 'd!gif get real',
	keys: ['g', 'gif'],
	blacklisted: true,
	required: ["search", "scroll"],
	execute(message, args, managers = {}) {
		managers.search.giphySearch(message, args, managers.scroll);
	},
};

