module.exports = {
	name: 'Quote',
	description: 'Saves a message.',
	keys: ['r', 'reference'],
	required: ["quotes"],
	execute(message, args, managers = {}) {
		managers.quotes.reference(message, args);
	},
};

