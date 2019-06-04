module.exports = {
	name: 'Ping',
	description: 'You know what ping does.',
	key: 'ping',
	execute(message, args, managers) {
		message.channel.send('Pong.');
	},
};