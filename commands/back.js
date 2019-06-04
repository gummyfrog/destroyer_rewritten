module.exports = {
	name: 'b',
	description: 'Back!',
	required: ["scroll"],
	execute(message, args, managers = {}) {
		managers.scroll.getOffsetGlobalScrollIndex(-1);
		message.delete()
	},
};

