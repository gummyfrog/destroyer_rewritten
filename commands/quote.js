module.exports = {
	name: 'Quote',
	description: 'Saves a message.',
	example: 'd!q [word or phrase in a recent message], or d!q [message id], or d!q [@user]',
	keys: ['q', 'quote'],
	required: ["quotes"],
	execute(message, args, managers = {}) {
		managers.quotes.quote(message, args);
	},
};

