var config = {};
var colors = {};

exports.use = function(conf) {
	config = conf;
	colors = conf.colors;
}

exports.push = function(bot,body) {
	bot.say(config.channel,colors.wrap("dark_blue",body.pusher.full_name)+" pushed "+colors.codes.gray+body.commits.length+" commit"+(body.commits.length!=1 ? "s" : "")+colors.codes.reset+(body.ref.startsWith("refs/heads/") ? " to "+colors.wrap("magenta",body.ref.replace("refs/heads/","")) : "")+". ("+(body.commits.map(x => x.message.split('\n')[0]).join(", "))+")");
}
