/*global jeversi, require*/
var io = require("./src/ClientSocket"),
clientSocket = new io.Socket("localhost", { port: 8888, debug:false }),
proxy = jeversi.createProxy(clientSocket);
jeversi.createRobot(proxy, jeversi.minUpToThresholdFlippableStrategy(64));
proxy.addEventListener("EventReceived", function(evt){
	if (evt.type==="finish"){
		//clientSocket.close();
		process.exit();
	}
});
