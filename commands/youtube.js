module.exports = {
	name: 'ys',
	description: 'YouTube!',
	blacklisted: true,
	required: ["searcher"],
	execute(message, args, managers = {}) {
		managers.searcher.ytSearch(message, args);
	},
};

