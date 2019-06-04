module.exports = {
	name: 's',
	description: 'Search!',
	blacklisted: true,
	required: ["searcher", "scroll"],
	execute(message, args, managers = {}) {
		managers.searcher.imageSearch(message, args, managers.scroll);
	},
};

