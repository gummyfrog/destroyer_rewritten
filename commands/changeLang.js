module.exports = {
	name: 'Change Language',
	description: 'Changes the translation language.',
	keys: ['lang', 'language'],
	required: ["translator"],
	execute(message, args, managers = {}) {
		managers.translator.changelang(message, args);
	},
};

