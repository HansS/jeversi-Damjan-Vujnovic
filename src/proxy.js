/*global console*/
jeversi.createProxy = function (socket) {
	var proxy = observable({
		place: function (token, row, column) {
			console.log("place", token, row, column);
			socket.send(jeversi.createEvent("place", token, row, column));
		}
	});
	socket.on("message", function (event) {
		console.log("onMessage", event);
		proxy.dispatchEvent("EventReceived", event);
	});
	return proxy;
};