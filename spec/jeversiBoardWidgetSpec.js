describe("jeversiBoardWidget", function () {
	var proxy = observable({
		place: function (token, row, column) {
		}
	}), dispatchEvent = function () {
		proxy.dispatchEvent("EventReceived", jeversi.createEvent.apply(jeversi, arguments));
	}, widget, retrieveButton = function (row, column) {
		return $(widget.find(":button")[8 * (row - 1) + column - 1]);
	};
	beforeEach(function () {
		(widget = $("#jeversiBoardWidget")).jeversiBoardWidget(proxy);
	});
	it("should show own token when init event is received", function () {
		dispatchEvent("init", "black");
		expect(widget.find(".token").text()).toBe("black");
	});
	it("should show 'New game started' status when start event is received", function () {
		dispatchEvent("start");
		expect(widget.find(".status").text()).toBe("New game started");
	});
	it("should reset all the buttons when start event is received", function () {
		dispatchEvent("start");
		expect($(widget.find(":button")).val()).toBe("-");
	});
	it("should update the right buttons when take event is received", function () {
		dispatchEvent("take", "white", 2, 3);
		expect(retrieveButton(2, 3).val()).toBe("w");
	});
	it("should show 'white|black is next' status when next event is received", function () {
		dispatchEvent("next", "black");
		expect(widget.find(".status").text()).toBe("black is next");
	});
	it("should show 'invalid move by white|black' status when reject event is received", function () {
		dispatchEvent("reject", "white");
		expect(widget.find(".status").text()).toBe("invalid move by white");
	});
	it("should show 'invalid move by white|black' status when reject event is received", function () {
		dispatchEvent("reject", "white");
		expect(widget.find(".status").text()).toBe("invalid move by white");
	});
	it("should show 'game over. winner:white|black' status when finish event is received", function () {
		proxy.dispatchEvent("EventReceived", {
			type: "finish",
			outcome: "black",
			black: 5,
			white: 3
		});
		expect(widget.find(".status").text()).toBe("game over. winner:black 5:3");
	});
	it("should invoke proxy.place when button is clicked", function () {
		dispatchEvent("init", "black");
		spyOn(proxy, "place");
		retrieveButton(2, 3).click();
		expect(proxy.place).toHaveBeenCalledWith("black", 2, 3);
	});
});