jeversi.createReverseProxy = function (game, token, socket) {
	game.addEventListener("EventReceived",function(e){socket.send(e);});
	socket.on("message", function(evt) {
		console.log("invoking: " + evt.type + " " + token );
		game[evt.type](token,evt.row,evt.column);
	});
	socket.send(jeversi.createEvent("init", token));
};
