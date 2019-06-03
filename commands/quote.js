module.exports = {
	name: 'q',
	description: 'Quote!',
	required: ["quotes"],
	execute(message, args, managers = {}) {
		managers.quotes.findMessage(message, args);
	},
};

