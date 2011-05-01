/*global console, jeversi, require*/
(function () {
	var http = require("http"),
	io = require("socket.io"),
	nodeStatic = require("node-static"),
	file = new nodeStatic.Server("."),
	server, socket, whiteSocket,
	startGame = function (blackSocket) {
		var game = jeversi.createGame();
		jeversi.createReverseProxy(game, "white", whiteSocket);
		jeversi.createReverseProxy(game, "black", blackSocket);
		game.start();
		whiteSocket = undefined;
	};
	server = http.createServer(function (req, res) {
		req.addListener("end", function () {
			file.serve(req, res);
		});
	});
	server.listen(8888);
	socket = io.listen(server);
	socket.on("connection", function (clientSocket) {
		if (whiteSocket) {
			startGame(clientSocket);
		} else {
			whiteSocket = clientSocket;
		}
	});
})();