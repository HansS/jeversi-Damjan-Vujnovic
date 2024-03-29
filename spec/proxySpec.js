/*global beforeEach, describe, expect, it, jasmine, jeversi, observable, spyOn*/
describe("Proxy", function () {
	it("should delegate place", function () {
		var socket = { send: function () {}, on: function () {} },
		proxy = jeversi.createProxy(socket);
		spyOn(socket, "send");
		proxy.place("white", 3, 4);
		expect(socket.send).toHaveBeenCalledWith(jeversi.createEvent("place", "white", 3, 4));
	});
	it("should dispatch events coming from the wire to listeners", function () {
		var wire,
		evt = jeversi.createEvent("take", "white", 2, 3),
		socket = {
			on: function (type, callback) {
				if (type === "message") {
					wire = callback;
				}
			}
		},
		proxy = jeversi.createProxy(socket),
		listener = jasmine.createSpy();
		proxy.addEventListener("EventReceived", listener);
		wire(evt);
		expect(listener).toHaveBeenCalledWith(evt);
	});
});