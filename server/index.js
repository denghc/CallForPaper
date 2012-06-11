var module = require("./neko");
var app = new module.askRoom();
app.SetConfig({
	"ListenPort" : 8080,
	"MaxClientNum" : 300
});
app.Startup();