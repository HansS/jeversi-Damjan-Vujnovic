function createGame() {
	var _eventCount=0;
	return {
		eventCount: function(){
			return _eventCount;
		} 
	}
};

