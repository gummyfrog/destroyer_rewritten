module.exports = {
	name: 'h',
	description: 'Help!',
	required: ["embeds", "help"],
	execute(message, args, managers = {}) {
		message.channel.send(managers.embeds.help(managers.help));
	},
};

