var config = {};

function onCommand(nick,channel,cmd,args) {
	if (cmd!="watching") {
		return;
	}
	if (config.channels[channel]) {
		this.say(channel,nick+": This channel is watching "+config.channels[channel].replace(/[(.)]/g,"")+".");
	}
}

exports.use = function(conf) {
	config = conf;
}

exports.register = function(bot) {
	bot.on("command",onCommand);
}
