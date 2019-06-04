module.exports = {
	name: 'gs',
	description: 'Google Search!',
	blacklisted: true,
	required: ["searcher"],
	execute(message, args, managers = {}) {
		managers.searcher.googleSearch(message, args);
	},
};

