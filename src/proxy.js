jeversi.createProxy = function (socket) {
	var proxy = observable({
		place: function (token, row, column) {
			socket.send(["place", token, row, column]);
		}
	});
	socket.on("message",function(evt){proxy.dispatchEvent("EventReceived",evt);})
	return proxy;
};