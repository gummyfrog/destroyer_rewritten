module.exports = {
	name: 'Quote',
	description: 'Saves a message.',
	key: 'q',
	required: ["quotes"],
	execute(message, args, managers = {}) {
		managers.quotes.findMessage(message, args);
	},
};

