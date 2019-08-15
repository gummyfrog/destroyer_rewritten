module.exports = {
	name: 'Help',
	description: 'Lists all commands.',
	keys: ['m', 'managers'],
	required: ["embeds", "managerList"],
	execute(message, args, managers = {}) {
		message.channel.send(managers.embeds.help(managers.managerList));
	},
};

