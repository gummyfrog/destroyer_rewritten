module.exports = {
	name: 'Google Search',
	description: 'Performs a Google search.',
	keys: ['gs', 'googlesearch'],
	blacklisted: true,
	required: ["search", "scroll"],
	execute(message, args, managers = {}) {
		managers.search.googleSearch(message, args, managers.scroll);
	},
};

