module.exports = {
	name: '8 Ball',
	description: "Prophecy",
	keys: ['ball'],
	required: ["embeds"],
	execute(message, args, managers = {}) {
		let prophecies = [
		"You're Fucked", 
		"Answer Not Clear", 
		"Try Again Later", 
		"Everything will be OK!", 
		"Nothing Matters Anyway", 
		"Who Cares", 
		"Don't Bother", 
		"Stop", 
		"Use a Twitter Poll", 
		"Tarot: Ten Of Swords", 
		"Tarot: Death", 
		"Tarot: Five Of Pentacles", 
		"Tarot: Three Of Swords", 
		"Tarot: The Tower"]
		message.channel.send(managers.embeds.prophecy(prophecies[Math.floor(Math.random() * prophecies.length)]))
	},
};

