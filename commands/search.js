module.exports = {
	name: 's',
	description: 'Search!',
	blacklisted: true,
	required: ["searcher"],
	execute(message, args, managers = {}) {
		managers.searcher.lastMessage = message;
		managers.searcher.search(args);
	},
};

