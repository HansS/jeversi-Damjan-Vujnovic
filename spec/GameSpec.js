describe("Game", function() {
	var game;
	
	beforeEach(function() {
		game = createGame();
	});

	it("should start with no events", function() {
		expect(game.eventCount()).toEqual(0);
	});
  });
