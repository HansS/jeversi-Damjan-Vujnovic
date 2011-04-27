describe("ReverseProxy", function () {
	it("should delegate place", function () {
		var wire;
		var socket = { on: function (type, callback) {
			if ("message"==type) wire=callback;
		} };	
		var game = observable({  place:function(){} });
		spyOn(game,"place");			
		var proxy = jeversi.createReverseProxy(game,socket);		
		wire(["place","white",3,4]);		
		expect(game.place).toHaveBeenCalledWith("white",3,4);
	});
	
	it("should dispatch events coming from the game to socket", function () {
		var socket = { send: function () {}, on:function(){} };
		var game= observable({});
		var evt =jeversi.createEvent("start");
		var proxy = jeversi.createReverseProxy(game,socket);
		spyOn(socket, "send");
		game.dispatchEvent("EventReceived", evt);
		expect(socket.send).toHaveBeenCalledWith(evt);
	})
});