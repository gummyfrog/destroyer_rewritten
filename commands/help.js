module.exports = {
	name: 'Help',
	description: 'Lists all commands.',
	key: 'h',
	required: ["embeds", "help"],
	execute(message, args, managers = {}) {
		message.channel.send(managers.embeds.help(managers.help));
	},
};

