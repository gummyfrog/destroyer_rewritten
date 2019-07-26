module.exports = {
	name: 'Translate',
	description: 'Translates some text.',
	keys: ['tr', 'translate'],
	required: ["translator"],
	execute(message, args, managers = {}) {
		managers.translator.translate(message, args);
	},
};

