jeversi.createReverseProxy = function (game,socket) {
	var proxy ={
	            
	};
	game.addEventListener("EventReceived",function(e){socket.send(e);});
	socket.on("message", function(msg) {
		game[msg[0]].apply(game, msg.slice(1));
	});
	return proxy;
};