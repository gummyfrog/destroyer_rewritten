module.exports = {
	name: 'sc',
	description: 'Scrub',
	required: ["scroll"],
	execute(message, args, managers = {}) {
		var i = 1;
		if(args != null) {i = parseInt(args);}
		managers.scroll.setGlobalScrollIndex(i);
		message.delete()
	},
};

