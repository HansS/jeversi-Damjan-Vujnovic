/*global beforeEach, describe, expect, it, jeversi*/
describe("next", function () {
	it("should give last event of type next", function () {
		var events = [
			jeversi.createEvent("next", "black"),
			jeversi.createEvent("next", "white")
		];
		expect(jeversi.next(events)).toEqual("white");
	});
});

describe("flippable should return a continuous range of opposing tokens bound by the active token", function () {
	it("should return a single token if next is opposing", function () {
		expect(jeversi.flippable([
			jeversi.createEvent("take", "white", 1, 1),
			jeversi.createEvent("take", "black", 1, 2)
		], "black")).toEqual([jeversi.createEvent("take", "white", 1, 1)]);
		expect(jeversi.flippable([
			jeversi.createEvent("take", "black", 2, 2),
			jeversi.createEvent("take", "white", 1, 1)
		], "white")).toEqual([jeversi.createEvent("take", "black", 2, 2)]);
	});
	it("should return nothing if the range is empty", function () {
		expect(jeversi.flippable([], "black")).toEqual([]);
	});
	it("should return nothing if next is not opposing", function () {
		expect(jeversi.flippable([jeversi.createEvent("take", "black", 1, 2)], "black")).toEqual([]);
	});
	it("should ignore anything past the boundary", function () {
		expect(jeversi.flippable([
			jeversi.createEvent("take", "white", 1, 1),
			jeversi.createEvent("take", "black", 1, 2),
			jeversi.createEvent("take", "white", 1, 3),
			jeversi.createEvent("take", "black", 1, 4)
		], "black")).toEqual([
			jeversi.createEvent("take", "white", 1, 1)
		]);
	});
	it("should capture a continuous range", function () {
		expect(jeversi.flippable([
			jeversi.createEvent("take", "white", 1, 1),
			jeversi.createEvent("take", "white", 1, 2),
			jeversi.createEvent("take", "white", 1, 3),
			jeversi.createEvent("take", "black", 1, 4)
		], "black")).toEqual([
			jeversi.createEvent("take", "white", 1, 1),
			jeversi.createEvent("take", "white", 1, 2),
			jeversi.createEvent("take", "white", 1, 3)
		]);
	});
	it("should ignore unbound ranges", function () {
		expect(jeversi.flippable([
			jeversi.createEvent("take", "white", 1, 1),
			jeversi.createEvent("take", "white", 1, 2),
			jeversi.createEvent("take", "white", 1, 3)
		])).toEqual([]);
	});
});

describe("declareWinner", function () {
	it("should return", function () {
		expect(jeversi.declareWinner({
			black: 0,
			white: 27
		})).toBe("white");
		expect(jeversi.declareWinner({
			black: 27,
			white: 0
		})).toBe("black");
	});
});

describe("PositionIndex", function () {
	var index;
	beforeEach(function () {
		index = jeversi.createPositionIndex();
	});
	it("should start empty", function () {
		expect(index.size()).toBe(0);
	});
	it("should index events by row and column", function () {
		var evt = jeversi.createEvent("take", "white", 5, 4);
		index.indexEvent(evt);
		expect(index.get(5, 4)).toBe(evt);
		expect(index.size()).toBe(1);
	});
	it("should ignore non field events", function () {
		index.indexEvent(jeversi.createEvent("draw"));
		expect(index.size()).toBe(0);
	});
	it("should index events on different rows and columns", function () {
		var evt = jeversi.createEvent("take", "white", 5, 4),
		evt2 = jeversi.createEvent("take", "black", 5, 5);
		index.indexEvent(evt);
		index.indexEvent(evt2);
		expect(index.get(5, 4)).toBe(evt);
		expect(index.get(5, 5)).toBe(evt2);
		expect(index.size()).toBe(2);
	});
	it("chain should return empty if next in direction is empty", function () {
		expect(index.chain(2, 2, -1, -1)).toEqual([]);
	});
	it("chain should ignore oposite direction", function () {
		var evt = jeversi.createEvent("take", "white", 3, 3);
		index.indexEvent(evt);
		expect(index.chain(2, 2, -1, -1)).toEqual([]);
	});
	it("chain should return a single event if row/column in a direction after event is empty", function () {
		var evt = jeversi.createEvent("take", "white", 3, 3);
		index.indexEvent(evt);
		expect(index.chain(2, 2, 1, 1)).toEqual([evt]);
	});
	it("chain should return an uninterrupted sequence of events", function () {
		var evt = jeversi.createEvent("take", "white", 3, 3),
		evt2 = jeversi.createEvent("take", "white", 4, 4);
		index.indexEvent(evt);
		index.indexEvent(evt2);
		index.indexEvent(jeversi.createEvent("take", "white", 6, 6));
		expect(index.chain(2, 2, 1, 1)).toEqual([evt, evt2]);
	});
	it("chain should return a complete sequence of events if it hits a boundary", function () {
		var evt = jeversi.createEvent("take", "white", 7, 7),
		evt2 = jeversi.createEvent("take", "white", 8, 8);
		index.indexEvent(evt);
		index.indexEvent(evt2);
		expect(index.chain(6, 6, 1, 1)).toEqual([evt, evt2]);
	});
	it("should index only last event in case of multiple events on the same row and column", function () {
		index.indexEvent(jeversi.createEvent("take", "white", 5, 4));
		var evt = jeversi.createEvent("flip", "black", 5, 4);
		index.indexEvent(evt);
		expect(index.get(5, 4)).toBe(evt);
		expect(index.size()).toBe(1);
	});
	it("countTokens should count black and white tokens", function () {
		var index = jeversi.createPositionIndex([
			jeversi.createEvent("take", "white", 1, 1),
			jeversi.createEvent("take", "white", 2, 1),
			jeversi.createEvent("take", "black", 3, 1)
		]);
		expect(index.countTokens()).toEqual({
			black: 1,
			white: 2
		});
//		index = jeversi.createPositionIndex([
//			jeversi.createEvent("take", "black", 1, 1),
//			jeversi.createEvent("take", "white", 2, 1),
//			jeversi.createEvent("take", "black", 3, 1)
//		]);
//		expect(index.tokenMajority()).toBe("black");
//		index = jeversi.createPositionIndex([
//			jeversi.createEvent("take", "white", 2, 1),
//			jeversi.createEvent("take", "black", 3, 1)
//		]);
//		expect(index.tokenMajority()).toBe("draw");
	});
});

describe("getFlippableTokens", function () {
	it("should look for flippable in all directions", function () {
		var events = [
			jeversi.createEvent("take", "white", 1, 1), jeversi.createEvent("take", "white", 3, 1), jeversi.createEvent("take", "white", 5, 1),
			jeversi.createEvent("take", "white", 1, 3), jeversi.createEvent("take", "white", 5, 3),
			jeversi.createEvent("take", "white", 1, 5), jeversi.createEvent("take", "white", 3, 5), jeversi.createEvent("take", "white", 5, 5),
			jeversi.createEvent("take", "black", 2, 2), jeversi.createEvent("take", "black", 3, 2), jeversi.createEvent("take", "black", 4, 2),
			jeversi.createEvent("take", "black", 2, 3), jeversi.createEvent("take", "black", 4, 3),
			jeversi.createEvent("take", "black", 2, 4), jeversi.createEvent("take", "black", 3, 4), jeversi.createEvent("take", "black", 4, 4)
		],
		index = jeversi.createPositionIndex(events),
		result = jeversi.getFlippableTokens(index, "white", 3, 3);
		expect(result).toContain(jeversi.createEvent("take", "black", 2, 2));
		expect(result).toContain(jeversi.createEvent("take", "black", 3, 2));
		expect(result).toContain(jeversi.createEvent("take", "black", 4, 2));
		expect(result).toContain(jeversi.createEvent("take", "black", 2, 3));
		expect(result).toContain(jeversi.createEvent("take", "black", 4, 3));
		expect(result).toContain(jeversi.createEvent("take", "black", 2, 4));
		expect(result).toContain(jeversi.createEvent("take", "black", 3, 4));
		expect(result).toContain(jeversi.createEvent("take", "black", 4, 4));
		expect(result.length).toEqual(8);
	});
});

describe("Game", function () {
	var game, previousCount, eventBuffer = [],
	generatedEvents = function () {
		var copy = eventBuffer;
		eventBuffer = [];
		return copy;
	},
	clearEvents = function () {
		eventBuffer = [];
	};
	beforeEach(function () {
		game = jeversi.createGame();
		game.start();
		game.addEventListener("EventReceived", function (event) {
			eventBuffer.push(event);
		});
	});
	it("should start with a start, four initial allocation events and a next", function () {
		game = jeversi.createGame();
		game.addEventListener("EventReceived", function (event) {
			eventBuffer.push(event);
		});
		game.start();
		expect(generatedEvents()).toEqual([
			jeversi.createEvent("start"),
			jeversi.createEvent("take", "white", 4, 4),
			jeversi.createEvent("take", "white", 5, 5),
			jeversi.createEvent("take", "black", 5, 4),
			jeversi.createEvent("take", "black", 4, 5),
			jeversi.createEvent("next", "white")
		]);
	});
	it("should reject placement outside of bounds", function () {
		game = jeversi.createGame(2);
		game.start();
		game.addEventListener("EventReceived", function (event) {
			eventBuffer.push(event);
		});
		game.place("white", 3, 1);
		expect(generatedEvents()).toContain(jeversi.createEvent("reject", "white"));
		game.place("white", 1, 3);
		expect(generatedEvents()).toContain(jeversi.createEvent("reject", "white"));
		game.place("white", 2, -1);
		expect(generatedEvents()).toContain(jeversi.createEvent("reject", "white"));
	});
	it("should reject a command if not that players turn", function () {
		game.place("black", 4, 3);
		expect(generatedEvents()).toEqual([jeversi.createEvent("reject", "black")]);
	});
	it("should reject a command if already taken", function () {
		game.place("white", 5, 4);
		expect(generatedEvents()).toEqual([jeversi.createEvent("reject", "white")]);
	});
	it("should reject a command if not next to a flippable token", function () {
		game.place("white", 7, 4);
		expect(generatedEvents()).toEqual([jeversi.createEvent("reject", "white")]);
	});
	it("should accept a command if next to a flippable token", function () {
		game.place("white", 6, 4);
		expect(generatedEvents()).toContain(jeversi.createEvent("take", "white", 6, 4));
	});
	it("should flip all flippable tokens after a successful placement", function () {
		game.place("white", 6, 4);
		expect(generatedEvents()).toContain(jeversi.createEvent("flip", "white", 5, 4));
	});
	it("should allow the opposing token to play", function () {
		game.place("white", 6, 4);
		expect(generatedEvents()).toContain(jeversi.createEvent("next", "black"));
	});
	it("should not allow the opposing token to play if there are no flippable tokens. the following scenario allows only white to play after 3,1", function () {
		game = jeversi.createGame(4, [
			jeversi.createEvent("take", "white", 2, 1),
			jeversi.createEvent("take", "black", 3, 1),
			jeversi.createEvent("take", "black", 2, 2),
			jeversi.createEvent("next", "white")
		]);
		game.addEventListener("EventReceived", function (event) {
			eventBuffer.push(event);
		});
		game.place("white", 4, 1);
		expect(generatedEvents()).toContain(jeversi.createEvent("next", "white"));
	});
	it("should declare winner when no more flippable tokens", function () {
		game = jeversi.createGame(4, [
			jeversi.createEvent("take", "white", 2, 1),
			jeversi.createEvent("take", "black", 3, 1),
			jeversi.createEvent("next", "white")
		]);
		game.addEventListener("EventReceived", function (event) {
			eventBuffer.push(event);
		});
		game.place("white", 4, 1);
		expect(generatedEvents()).toContain({
			type: "finish",
			outcome: "white",
			white: 3,
			black: 0
		});
	});
});
