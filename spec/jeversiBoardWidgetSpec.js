describe("jeversiBoardWidget", function () {
	var proxy = observable({
		place: function (token, row, column) {
		}
	});
	beforeEach(function () {
		$("#jeversiBoardWidget").jeversiBoardWidget(proxy);
	});
	it("should show own token when init event is received", function () {
		proxy.dispatchEvent("EventReceived", jeversi.createEvent("init", "black"));
		expect($("#jeversiBoardWidget").find(".token").text()).toBe("black");
	});
	it("should show 'New game started' status when start event is received", function () {
		proxy.dispatchEvent("EventReceived", jeversi.createEvent("start"));
		expect($("#jeversiBoardWidget").find(".status").text()).toBe("New game started");
	});
	it("should reset all the buttons when start event is received", function () {
		proxy.dispatchEvent("EventReceived", jeversi.createEvent("start"));
		expect($($("#jeversiBoardWidget").find(":button")).val()).toBe("-");
	});
	it("should update the right buttons when take event is received", function () {
		proxy.dispatchEvent("EventReceived", jeversi.createEvent("take", "white", 2, 3));
		var button_2_3 = $($("#jeversiBoardWidget").find(":button")[10]);
		expect(button_2_3.val()).toBe("w");
	});
	it("should show 'white|black is next' status when next event is received", function () {
		proxy.dispatchEvent("EventReceived", jeversi.createEvent("next", "black"));
		expect($("#jeversiBoardWidget").find(".status").text()).toBe("black is next");
	});
	it("should show 'invalid move by white|black' status when reject event is received", function () {
		proxy.dispatchEvent("EventReceived", jeversi.createEvent("reject", "white"));
		expect($("#jeversiBoardWidget").find(".status").text()).toBe("invalid move by white");
	});
	it("should show 'invalid move by white|black' status when reject event is received", function () {
		proxy.dispatchEvent("EventReceived", jeversi.createEvent("reject", "white"));
		expect($("#jeversiBoardWidget").find(".status").text()).toBe("invalid move by white");
	});
	it("should show 'game over. winner: white|black' status when finish event is received", function () {
		proxy.dispatchEvent("EventReceived", jeversi.createEvent("finish", "black"));
		expect($("#jeversiBoardWidget").find(".status").text()).toBe("game over. winner:black");
	});
	it("should invoke proxy.place when button is clicked", function () {
		proxy.dispatchEvent("EventReceived", jeversi.createEvent("init", "black"));
		spyOn(proxy, "place");
		var button_2_3 = $($("#jeversiBoardWidget").find(":button")[10]);
		button_2_3.click();
		expect(proxy.place).toHaveBeenCalledWith("black", 2, 3);
	});
});