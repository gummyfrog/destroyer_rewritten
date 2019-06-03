module.exports = {
	name: 'n',
	description: 'Next!',
	required: ["searcher"],
	execute(message, args, managers = {}) {
		managers.searcher.getOffsetGlobalScrollIndex(1);
		message.delete()
	},
};

