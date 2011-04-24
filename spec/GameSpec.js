describe("next", function(){
	it ("should give last event of type next", function(){
		var events=[createEvent("next","black"),
			createEvent("next","white")];
		expect(next(events)).toEqual("white");
	});
});

describe("PositionIndex", function(){
	var eventIndex;
	beforeEach(function() {
		index = createPositionIndex();
	});
	it ("should start empty", function(){
		expect(index.size()).toBe(0);
	});
	it("should index events by row and column", function(){
		var evt=createEvent("take","white",5,4);
		index.indexEvent(evt);
		expect(index.get(5,4)).toBe(evt);
		expect(index.size()).toBe(1);
	});
	it ("should ignore non field events", function(){
        	index.indexEvent(createEvent("draw"));
		expect(index.size()).toBe(0);
 	});
	it("should index events on different rows and columns", function(){
		var evt=createEvent("take","white",5,4);
		index.indexEvent(evt);

		var evt2=createEvent("take","black",5,5);
		index.indexEvent(evt2);

		expect(index.get(5,4)).toBe(evt);
		expect(index.get(5,5)).toBe(evt2);

		expect(index.size()).toBe(2);
	});
	it("should return all indexed events for nearby fields when asked for neighbours", function(){
		var rightBottom=createEvent("take","white",5,4);
		var bottom=createEvent("take","black",5,5);
		var leftTop=createEvent("take","white",3,4);
		var outside=createEvent("take","black",7,7);
		index.indexEvent(rightBottom);
		index.indexEvent(bottom);
		index.indexEvent(leftTop);
		index.indexEvent(outside);
		expect(index.neighbours(4,5)).toEqual([
			leftTop,rightBottom,bottom
		]);
		
});
	it("should index only last event in case of multiple events on the same row and column", function(){
		index.indexEvent(createEvent("take","white",5,4));
		var evt=createEvent("flip","black",5,4);
		index.indexEvent(evt);
		expect(index.get(5,4)).toBe(evt);
		expect(index.size()).toBe(1);
	});

});
describe("Game", function() {
	var game;
	var previousCount;
	var generatedEvents= function(){
		return game.getEvents().slice(previousCount);
	}
	beforeEach(function() {
		game = createGame();
		previousCount=game.getEvents().length;
	});
	it("should start with four initial allocation events", function() {
		expect(game.eventCount()).toEqual(5);
		expect(game.getEvents()).toEqual([
			createEvent("take","white",4,4),
			createEvent("take","white",5,5),
			createEvent("take","black",5,4),
			createEvent("take","black",4,5),
			createEvent("next","white")]);
	});
	it("should not allow clients to modify events", function(){
		game.getEvents().push(createEvent("draw"));
		expect(game.eventCount()).toEqual(5);
	});
	it("should reject a command if not that players turn", function () {
		game.place("black", 4, 3);
		expect(generatedEvents()).toEqual([createEvent("reject", "black")]);
	});
	it("should reject a command if already taken", function () {
		game.place("white", 5, 4);
		expect(generatedEvents()).toEqual([createEvent("reject", "white")]);
	});
	it("should reject a command if not next to opposing token", function () {
		game.place("white", 7, 4);
		expect(generatedEvents()).toEqual([createEvent("reject", "white")]);
	});
	it("should accept a command if next to opposing token", function () {
		game.place("white", 6, 4);
		expect(generatedEvents()).toEqual([createEvent("take", "white",6,4)]);
	});
  });
