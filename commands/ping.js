module.exports = {
	name: 'Ping',
	description: 'You know what ping does.',
	keys: ['p', 'ping'],
	execute(message, args, managers) {
		message.channel.send('Pong.');
	},
};