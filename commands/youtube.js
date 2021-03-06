module.exports = {
	name: 'YouTube Search',
	description: 'Looks for a YouTube video.',
	example: "d!ys gangnam style",
	keys: ['y', 'ys', 'youtube'],
	blacklisted: true,
	required: ["search", "scroll"],
	execute(message, args, managers = {}) {
		managers.search.ytSearch(message, args, managers.scroll);
	},
};

