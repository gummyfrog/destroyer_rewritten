module.exports = {
	name: 'Next',
	description: 'Scrolls the results list forward.',
	key: 'n',
	required: ["scroll"],
	execute(message, args, managers = {}) {
		managers.scroll.getOffsetGlobalScrollIndex(1);
		message.delete()
	},
};

