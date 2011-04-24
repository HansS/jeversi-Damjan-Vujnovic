function createPositionIndex() {
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
		},
		neighbours:function(row,column){
			result=[];
			for (var row_offset=-1; row_offset<2; row_offset++){
				for (var col_offset=-1; col_offset<2; col_offset++){
				  if (index[key(row+row_offset,column+col_offset)]) result.push(index[key(row+row_offset,column+col_offset)]);
				}
			}
			return result;
		}
	};
	return result;
};
function createEvent(eventType, token, row, column) {
	var result = {
		type: eventType,
		token: token,
		row: row,
		column: column
	};
	return result;
};

var opposing=function(token){
	return token=="white"?"black":"white";
};
var next = function (events) {
		for (var i = events.length - 1; i >= 0; i--) {
			if (events[i].type === "next")
				return events[i].token;
		}
		throw new Error("Cannot determine next token");
};
var flippable=function(events, token){
	var result=[];
	for (var i=0; i<events.length; i++) {
		if (events[i].token==opposing(token)) result.push(events[i]);
		else return result;
	}
	return [];
}
function createGame() {
	var _eventCount=0;

	var containsToken = function (token, events) {
		for (var i = 0; i < events.length; i++)
			if (events[i].token === token)
				return true;
		return false;
	};
	
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
			var index=createPositionIndex();
			events.forEach(index.indexEvent);
			var isOK = next(events)==token && !index.get(row,column) && containsToken(opposing(token),index.neighbours(row,column));
			events.push(isOK ? createEvent("take",token,row,column) : createEvent("reject", token));
		}
	}
	return result;
};

