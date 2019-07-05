module.exports = {
	name: 'Google Search',
	description: 'Performs a Google search.',
	key: 'gs',
	blacklisted: true,
	required: ["searcher", "scroll"],
	execute(message, args, managers = {}) {
		managers.searcher.googleSearch(message, args, managers.scroll);
	},
};

