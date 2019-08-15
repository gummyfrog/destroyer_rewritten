module.exports = {
	name: 'Search',
	description: 'Performs a Google Images search.',
	keys: ['s', 'search'],
	blacklisted: true,
	required: ["search", "scroll"],
	execute(message, args, managers = {}) {
		managers.search.imageSearch(message, args, managers.scroll);
	},
};

