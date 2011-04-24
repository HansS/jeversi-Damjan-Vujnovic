function createPositionIndex(events) {
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
			 	
		},
		tokenMajority: function(){
			var majority=0;
			for (var key in index){
				if(index[key].token=="white") majority++; else majority--;
			}
			if (majority>0) return "white";
			if (majority<0) return "black";
			return "draw";
		}
	};
	if (events) { events.forEach(result.indexEvent);}
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

var getFlippableTokens=function(index,token,row,column){
	var result=[];
	for (var row_direction=-1; row_direction<=1; row_direction++){
		for (var column_direction=-1; column_direction<=1; column_direction++){
			if (row_direction!=0 || column_direction!=0){
				var chain=index.chain(row,column,row_direction,column_direction);
				var flipInChain=flippable(chain,token);
				result=result.concat(flipInChain);
			}
		}
	}
	return result;
}
function createGame(size,events) {
	var _eventCount=0;
	var _boardSize=size?size:8;
	var _center=_boardSize/2;

	var _events=events?events:[
                 createEvent("take","white",_center, _center),
                 createEvent("take","white",_center+1, _center+1),
                 createEvent("take","black",_center+1, _center),
                 createEvent("take","black",_center,_center+1),
                 createEvent("next","white")];

	var validPosition=function(row,column){
		return row>0 && column>0 && row<=_boardSize && column<=_boardSize;
	}
	var hasFlippable=function(token,index){
		for (var row=1; row<=_boardSize; row++)
			for (var column=1; column<=_boardSize; column++){
				if (!index.get(row,column) && getFlippableTokens(index,token,row,column).length>0)
					return true;
			}		
		return false;
	}
	var result={
		eventCount: function(){
			return _events.length;
		},
		getEvents: function () {
			return _events.slice(0);
		},
		place: function (token, row, column) {
			var index=createPositionIndex(_events);
			var flippableTokens=getFlippableTokens(index,token,row,column);
			if ( !validPosition(row,column) || next(_events)!=token || index.get(row,column) || flippableTokens.length==0){
				_events.push(createEvent("reject",token));
				return;
			}
			_events.push(createEvent("take",token,row,column));
			flippableTokens.forEach(function(toFlip){
				_events.push(createEvent("flip",token,toFlip.row, toFlip.column));
			});
			index=createPositionIndex(_events);
			if (hasFlippable(opposing(token),index)) 
				_events.push(createEvent("next",opposing(token)));
			else if (hasFlippable(token,index))
				_events.push(createEvent("next",token));
			else _events.push(createEvent("finish",index.tokenMajority()));
		}
	}
	return result;
};

