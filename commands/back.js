module.exports = {
	name: 'b',
	description: 'Back!',
	required: ["searcher"],
	execute(message, args, managers = {}) {
		managers.searcher.getOffsetGlobalScrollIndex(-1);
		message.delete()
	},
};

