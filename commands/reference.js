module.exports = {
	name: 'Reference',
	description: 'Clones a message for reference.',
	keys: ['r', 'reference'],
	required: ["quotes"],
	execute(message, args, managers = {}) {
		managers.quotes.reference(message, args);
		message.delete();
	},
};

