/*global console, jeversi*/
jeversi.createReverseProxy = function (game, token, socket) {
	game.addEventListener("EventReceived", function (event) {
		socket.send(event);
	});
	socket.on("message", function (event) {
		game[event.type](token, event.row, event.column);
	});
	socket.send(jeversi.createEvent("init", token));
};
