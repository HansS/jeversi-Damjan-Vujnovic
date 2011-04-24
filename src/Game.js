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
		chain: function(before_row,before_column,row_direction,column_direction){
			var resultchain=[];
		        var current_row=before_row+row_direction;
	 		var current_column=before_column+column_direction;
			while (index[key(current_row,current_column)]){
				resultchain.push(index[key(current_row,current_column)]);
				current_row=current_row+row_direction;
				current_column=current_column+column_direction;
			}
			return resultchain;
			 	
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
};
function createGame() {
	var _eventCount=0;
	var _boardSize=8;
	var getFlippableTokens=function(index,token,row,column){
		var result=[];
		for (var row_direction=-1; row_direction<=1; row_direction++){
			for (var column_direction=-1; column_direction<=1; column_direction++){
				if (row_direction!=0 || column_direction!=0)
					result=result.concat(flippable(index.chain(row,column,row_direction,column_direction),token));
			}
		}
		return result;
	}
	var events=[
                 createEvent("take","white",4,4),
                 createEvent("take","white",5,5),
                 createEvent("take","black",5,4),
                 createEvent("take","black",4,5),
                 createEvent("next","white")];

	var validPosition=function(row,column){
		return row>0 && column>0 && row<_boardSize && column<_boardSize;
	}
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
			var flippableTokens=getFlippableTokens(index,token,row,column);
			if ( !validPosition(row,column) || next(events)!=token || index.get(row,column) || flippableTokens.length==0){
				events.push(createEvent("reject",token));
				return;
			}
			events.push(createEvent("take",token,row,column));
			flippableTokens.forEach(function(toFlip){
				events.push(createEvent("flip",token,toFlip.row, toFlip.column));
			});
			events.push(createEvent("next",opposing(token)));
		}
	}
	return result;
};

