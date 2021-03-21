module.exports = {
	name: 'Managers',
	description: 'Lists all managers.',
	keys: ['m', 'managers'],
	required: ["embeds", "managerList"],
	execute(message, args, managers = {}) {
		message.channel.send(managers.embeds.help(managers.managerList));
	},
};

