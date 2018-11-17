var fs = require('fs');
var config = JSON.parse(fs.readFileSync("config.json"));
const util = require("./util");
const irc = require("irc-upd");
util.use(config);
var bot = new irc.Client("tilde.chat","giteabot",{channels:["#6502gen"],port:6697,secure:true})
var app = require("express")();
app.use(require("express").json());
app.use(function(req, res, next) {
	console.log("req");
	var data='';
	req.setEncoding('utf8');
	req.on('data', function(chunk) {
		data += chunk;
	});

	req.on('end', function() {
		req.rawData = data;
	});
	next();
});
app.post("/webhook/",function(req,res) {
	if (util.matchSecret(req,config.secret)) {
		util.on(req.get("X-GitHub-Event"),req.body,bot);
	}
	res.status = 200;
	res.end("OK");
});
app.listen(8001,function() {console.log("running on port 8001");});
bot.addListener('error', function(message) {
	console.log('error: ', message);
});
