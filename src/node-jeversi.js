(function () {
	var http = require("http"),
	io = require("socket.io"),
	nodeStatic = require("node-static"),
	file = new nodeStatic.Server("."),
	server, socket, whiteSocket,
	startGame = function (blackSocket) {
		console.log("startGame");
		var game = jeversi.createGame();
		jeversi.createReverseProxy(game, "white", whiteSocket);
		jeversi.createReverseProxy(game, "black", blackSocket);
		game.start();
		whiteSocket = null;
	};
	server = http.createServer(function(req, res) { 
		console.log("http request: ", req.url);
		req.addListener("end", function () {
			file.serve(req, res);
		});
	});
	server.listen(8888);
	socket = io.listen(server);
	socket.on("connection", function (clientSocket) {
		console.log("onConnection");
		if (whiteSocket) {
			startGame(clientSocket);
		} else {
			whiteSocket = clientSocket;
		}
		clientSocket.on("disconnect", function () {
			console.log("onDisconnect");
		});
	});
})();