module.exports = {
	name: 'n',
	description: 'Next!',
	required: ["scroll"],
	execute(message, args, managers = {}) {
		managers.scroll.getOffsetGlobalScrollIndex(1);
		message.delete()
	},
};

