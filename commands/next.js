module.exports = {
	name: 'Next',
	description: 'Scrolls the results list forward.',
	keys: ['n', 'next'],
	required: ["scroll"],
	execute(message, args, managers = {}) {
		managers.scroll.getOffsetGlobalScrollIndex(1);
		message.delete()
	},
};

