function createEventIndex() {
	var index = {};
	size = 0;
	var key = function (row, column) {
		return row + "_" + column;
	};
	var result = {
		size: function () {
			return size;
		},
		indexEvent: function (event) {
			if (event.row && event.column){
				var k = key(event.row, event.column);
				size += index[k] ? 0 : 1;
				index[k] = event;
			}
		},
		get: function (row, column) {
			return index[key(row,column)];
		}
	};
	return result;
};
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
		},
		place: function (token, row, column) {
			var index=createEventIndex();
			events.forEach(index.indexEvent);
			var event=createEvent("reject", token);
			events.push(event);
		}
	}
	return result;
};

