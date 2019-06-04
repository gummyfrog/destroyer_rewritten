module.exports = {
	name: 'Scrub',
	description: 'Shows a specific entry in the results list.',
	key: 'sc',
	required: ["scroll"],
	execute(message, args, managers = {}) {
		var i = 1;
		if(args != null) {i = parseInt(args);}
		managers.scroll.setGlobalScrollIndex(i);
		message.delete()
	},
};

