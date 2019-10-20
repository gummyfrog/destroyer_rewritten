module.exports = {
	name: 'Sound Beta',
	description: 'Sound Beta',
	keys: ['p', 'ps'],
	blacklisted: true,
	required: ["voice"],
	execute(message, args, managers = {}) {
		managers.voice.playSound(message, args);
	},
};

