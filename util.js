const log = require("./log").log;
const crypto = require("crypto");
var configured = false;
var config = {};
var handlers = {};
handlers.gitea = require("./handlers/gitea");

exports.use = function(conf) {
	configured = true;
	config = conf;
	handlers.gitea.use(conf);
}

exports.matchSecret = function(req,secret) {
	if (!configured) return false;
	if (config.type=="github") {
		var signature = req.get("X-Hub-Signature");
		var sign = function(data) { return "sha1=" + crypto.createHmac('sha1', options.secret).update(data).digest('hex'); };
	}
	if (config.type=="gitea") {
		var signature = req.body.secret;
		var sign = function(data) { return secret; };
	}
	return signature == sign(req.rawData);
};

exports.on = function(event,body,bot) {
	if (!configured) return false;
	if (handlers[config.type] === undefined) {
		log("error: No handlers implemented for " + config.type);
		return false;
	}
	if (handlers[config.type][event] === undefined) {
		log("error: No " + event + " handler implemented for " + config.type);
		return false;
	}
	var channel = null;
	for (var pchannel in config.channels) {
		if (body.repository.full_name.match(config.channels[pchannel])!==null) {
			channel = pchannel;
		}
	}
	if (channel===null) {
		log("error: No channel defined for repo "+body.full_name);
	}
	handlers[config.type][event](channel,bot,body);
}
