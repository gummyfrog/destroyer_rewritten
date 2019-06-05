module.exports = {
	name: 'YouTube Search',
	description: 'Looks for a YouTube video.',
	key: 'ys',
	blacklisted: true,
	required: ["searcher", "scroll"],
	execute(message, args, managers = {}) {
		managers.searcher.ytSearch(message, args, managers.scroll);
	},
};

