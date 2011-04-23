describe("Game", function() {
	var game;
	
	beforeEach(function() {
		game = new Game();
	});

	it("should start with no events", function() {
		expect(game.eventCount()).toEqual(0);
	});
  });
