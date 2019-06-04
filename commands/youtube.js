module.exports = {
	name: 'YouTube Search',
	description: 'Looks for a YouTube video.',
	key: 'ys',
	blacklisted: true,
	required: ["searcher"],
	execute(message, args, managers = {}) {
		managers.searcher.ytSearch(message, args);
	},
};

