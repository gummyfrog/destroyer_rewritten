module.exports = {
	name: 'c',
	description: 'Config',
	required: ["embeds", "config"],
	execute(message, args, managers = {}) {
		message.channel.send(managers.embeds.config(managers.config));
	},
};

