const crypto = require("crypto");
var configured = false;
var config = {};
var handlers = {};

exports.use = function(conf) {
	configured = true;
	config = conf;
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
		console.log("error: No handlers implemented for " + config.type);
		return false;
	}
	if (handlers[config.type][event] === undefined) {
		console.log("error: No " + event + " handler implemented for " + config.type);
		return false;
	}
	handlers[config.type][event](bot,body);
}
