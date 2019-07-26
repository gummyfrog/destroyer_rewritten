module.exports = {
	name: 'Back',
	description: 'Scrolls the results list backwards.',
	keys: ['b', 'back'],
	required: ["scroll"],
	execute(message, args, managers = {}) {
		managers.scroll.getOffsetGlobalScrollIndex(-1);
		message.delete()
	},
};

