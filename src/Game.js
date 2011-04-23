function createEvent(eventType, token, row, column) {
	var result = {
		eventType: eventType,
		token: token,
		row: row,
		column: column
	};
	return result;
};
function createGame() {
	var _eventCount=0;
	var events=[
                 createEvent("take","white",4,4),
                 createEvent("take","white",5,5),
                 createEvent("take","black",5,4),
                 createEvent("take","black",4,5),
                 createEvent("next","white")];
	var result={
		eventCount: function(){
			return events.length;
		},
		getEvents: function () {
			return events.slice(0);
		}
	}
	return result;
};

