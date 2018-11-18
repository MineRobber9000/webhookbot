var config = {};
var colors = {};

exports.use = function(conf) {
	config = conf;
	colors = conf.colors;
}

function getPrefix(body) {
	return colors.wrap("light_blue","[")+colors.wrap("light_gray",body.repository.full_name)+colors.wrap("light_blue","]")+" ";
}

exports.push = function(channel,bot,body) {
	bot.say(channel,getPrefix(body)+colors.wrap("dark_blue",body.pusher.full_name)+" pushed "+colors.codes.gray+body.commits.length+" commit"+(body.commits.length!=1 ? "s" : "")+colors.codes.reset+(body.ref.startsWith("refs/heads/") ? " to "+colors.wrap("magenta",body.ref.replace("refs/heads/","")) : "")+". ("+(body.commits.map(x => x.message.split('\n')[0]).join(", "))+")");
}
