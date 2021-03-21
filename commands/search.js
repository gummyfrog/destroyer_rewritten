module.exports = {
	name: 'Search',
	description: 'Performs a Google Images search.',
	example: 'd!s big smoked salmon',
	keys: ['s', 'search'],
	blacklisted: true,
	required: ["search", "scroll"],
	execute(message, args, managers = {}) {
		managers.search.imageSearch(message, args, managers.scroll);
	},
};

