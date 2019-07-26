module.exports = {
	name: 'Search',
	description: 'Performs a Google Images search.',
	keys: ['s', 'search'],
	blacklisted: true,
	required: ["searcher", "scroll"],
	execute(message, args, managers = {}) {
		managers.searcher.imageSearch(message, args, managers.scroll);
	},
};

