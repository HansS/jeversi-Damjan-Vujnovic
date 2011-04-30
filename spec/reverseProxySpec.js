/*global beforeEach, describe, expect, it, jasmine, jeversi, observable, spyOn*/
describe("ReverseProxy", function () {
	it("should send init event when creted", function () {
		var socket = {
			send: function () {
			},
			on: function () {
			}
		};
		spyOn(socket, "send");
		jeversi.createReverseProxy(observable({}), "white", socket);
		expect(socket.send).toHaveBeenCalledWith(jeversi.createEvent("init", "white"));
	});
	it("should delegate place", function () {
		var wire,
		socket = { 
			on: function (type, callback) {
				if (type === "message") {
					wire = callback;
				}
			},
			send: function () {
			}
		},
		game = observable({
			place: function () {
			}
		});
		spyOn(game, "place");
		jeversi.createReverseProxy(game, "white", socket);
		wire(jeversi.createEvent("place", "white", 3, 4));
		expect(game.place).toHaveBeenCalledWith("white", 3, 4);
	});
	it("should dispatch events coming from the game to socket", function () {
		var socket = {
			send: function () {
			},
			on: function () {
			}
		},
		game = observable({}),
		event = jeversi.createEvent("start"),
		proxy = jeversi.createReverseProxy(game, "white", socket);
		spyOn(socket, "send");
		game.dispatchEvent("EventReceived", event);
		expect(socket.send).toHaveBeenCalledWith(event);
	});
});