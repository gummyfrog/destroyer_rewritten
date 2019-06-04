module.exports = {
	name: 'Config',
	description: "Shows Jordan's configuration.",
	key: 'c',
	required: ["embeds", "config"],
	execute(message, args, managers = {}) {
		message.channel.send(managers.embeds.config(managers.config));
	},
};

