module.exports = {
	name: 'Config',
	description: "Shows Jordan's configuration.",
	keys: ['c', 'config'],
	required: ["embeds", "getConfig"],
	execute(message, args, managers = {}) {
		message.channel.send(managers.embeds.config(managers.getConfig()));
	},
};

