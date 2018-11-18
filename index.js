var log = require("./log").log;
var fs = require('fs');
var config = JSON.parse(fs.readFileSync("config.json"));
log("Config parsed!");
const util = require("./util");
const irc = require("irc-upd");
config.colors = irc.colors; // why require handlers to require("irc-upd") if we can just pass them the colors through the config?
util.use(config);
var opts = {channels:Object.keys(config.channels)};
opts = Object.assign(opts,config.opts);
var bot = new irc.Client(config.server,config.nick,opts);
var app = require("express")();
app.use(require("body-parser").json({verify:function(req,res,buf,encoding){ req.rawData = buf.toString(encoding); log(req.rawData); }}));
app.post("/webhook/",function(req,res) {
	log("Request hit the endpoint!");
	if (util.matchSecret(req,config.secret)) {
		util.on(req.get("X-GitHub-Event"),req.body,bot);
	}
	res.status(200).end();
});
bot.addListener('error', function(message) {
	log('error: ', message);
});

bot.on("message",function(nick,to,text,message) {
	if (!text.startsWith(config.prefix)) {
		return;
	}
	var args = text.slice(config.prefix.length).trim().split(/ +/g);
	var cmd = args.shift().toLowerCase()
	bot.emit("command",nick,to,cmd,args);
});

for (var command in config.commands) {
	command = require("./commands/"+config.commands[command]);
	command.use(config);
	command.register(bot);
}

app.listen(8001,function() {log("HTTP server running on port 8001");});
