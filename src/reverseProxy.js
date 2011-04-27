jeversi.createReverseProxy = function (game, token, socket) {
	game.addEventListener("EventReceived",function(e){socket.send(e);});
	socket.on("message", function(msg) {
		game[msg[0]].apply(game, msg.slice(1));
	});
	socket.send(jeversi.createEvent("init", token));
};