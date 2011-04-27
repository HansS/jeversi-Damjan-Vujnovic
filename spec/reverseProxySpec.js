describe("ReverseProxy", function () {
	it("should send init event when creted", function () {
		var socket = { send: function () {}, on:function(){} };
		spyOn(socket, "send");
		jeversi.createReverseProxy(observable({}), "white", socket);
		expect(socket.send).toHaveBeenCalledWith(jeversi.createEvent("init", "white"));
	});
	it("should delegate place", function () {
		var wire;
		var socket = { on: function (type, callback) {
			if ("message"==type) wire=callback;
		}, send: function () {
		}};
		var game = observable({  place:function(){} });
		spyOn(game,"place");			
		jeversi.createReverseProxy(game,"white", socket);		
		wire(["place","white",3,4]);		
		expect(game.place).toHaveBeenCalledWith("white",3,4);
	});
	
	it("should dispatch events coming from the game to socket", function () {
		var socket = { send: function () {}, on:function(){} };
		var game= observable({});
		var evt =jeversi.createEvent("start");
		var proxy = jeversi.createReverseProxy(game,"white", socket);
		spyOn(socket, "send");
		game.dispatchEvent("EventReceived", evt);
		expect(socket.send).toHaveBeenCalledWith(evt);
	})
});