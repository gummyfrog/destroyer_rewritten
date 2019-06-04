module.exports = {
	name: 'ping',
	description: 'Ping!',
	execute(message, args, managers) {
		message.channel.send('Pong.');
	},
};