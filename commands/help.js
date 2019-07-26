module.exports = {
	name: 'Help',
	description: 'Lists all commands.',
	keys: ['h', 'help'],
	required: ["embeds", "help"],
	execute(message, args, managers = {}) {
		message.channel.send(managers.embeds.help(managers.help));
	},
};

