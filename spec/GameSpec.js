describe("Game", function() {
	var game;
	
	beforeEach(function() {
		game = createGame();
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
  });
