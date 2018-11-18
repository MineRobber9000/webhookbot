var config = {};

exports.use = function(conf) {
	config = conf;
	console.log(conf);
}

exports.push = function(bot,body) {
	bot.say(config.channel,body.pusher.full_name+" pushed "+body.commits.length+" commit"+(body.commits.length!=1 ? "s" : "")+". ("+(body.commits.map(x => x.message.split('\n')[0]).join(", "))+")");
}
