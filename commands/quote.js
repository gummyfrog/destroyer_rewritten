module.exports = {
	name: 'Quote',
	description: 'Saves a message.',
	key: 'q',
	required: ["quotes", "updater"],
	execute(message, args, managers = {}) {
		managers.quotes.findMessage(message, args, managers.updater);
	},
};

