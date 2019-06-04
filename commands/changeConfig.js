module.exports = {
	name: 'Change Config',
	description: 'Messes with the config.',
	key: 'cf',
	required: ["embeds", "setConfig", "getConfig"],
	execute(message, args, managers = {}) {
		if(args != "") {
			var split = args.split(' ');
			var where = split.shift();
			var what = split.join(' ');
			managers.setConfig(where, what, managers.getConfig());
		}
	},
};

