function createGameController(){
  var _game;
  var _startGameListeners=[];
  var _eventListeners=[];
  var sendEvents=function(newEvents){
  	newEvents.forEach(function(event){
  		_eventListeners.forEach(function(listener){
			listener(event);
                });
        });
  }
  var result={
  	addEventListener:function(listener){
	  _eventListeners.push(listener);
        },
        addGameStartListener:function(listener){
	  _startGameListeners.push(listener);
        },
        place:function(token,row,column){
		var previousCount=_game.getEvents().length;
		_game.place(token,row,column);
		var newEvents=_game.getEvents().slice(previousCount);
	  	sendEvents(newEvents);	
	},
        startGame:function(){
      		_game=createGame();
		_startGameListeners.forEach(function(listener){ listener(); });
		sendEvents(_game.getEvents()); 
	}
  };
  return result;
}
function createGameFrame(element,controller,token){
  var clear=function(){
    while(element.hasChildNodes()) element.removeChild(element.firstChild);
  }
  var _status;
  var _buttons={};
  var key=function(row,column){
  	return row+ "_"+column;
  }
  var redraw=function(){
	var heading=document.createElement("h1");
	heading.innerText=token;
	element.appendChild(heading);
	_status=document.createElement("span");
        element.appendChild(_status);
	element.appendChild(document.createElement("br"));
	var table=document.createElement("table");
        _buttons={};
	for (var row=1; row<=8; row++){
		var tableRow=document.createElement("tr");
		table.appendChild(tableRow);
		for (var column=1; column<=8; column++){
		 	var tableColumn=document.createElement("td");
			tableRow.appendChild(tableColumn);
			var button=document.createElement("input");
			button.type="button";
			tableColumn.appendChild(button);
			button.value="-";
			button.gameRow=row;
			button.gameColumn=column;
			button.onclick=function(){ controller.place(token, this.gameRow , this.gameColumn );};
			_buttons[key(row,column)]=button;
		}
	}
	element.appendChild(table);
  }
  controller.addGameStartListener(function(){
	clear();
	redraw();
        _status.innerText="new game started";
  });
  controller.addEventListener(function(event){
	if (event.type=="take" || event.type=="flip"){
       		_buttons[key(event.row,event.column)].value=event.token[0];
	 }
	else if (event.type=="next"){
		_status.innerText=event.token + " is next";
	}
	else if (event.type=="reject"){
		_status.innerText="invalid move by "+event.token;
	}
	else if (event.type="finish"){
		_status.innerText="game over. winner:"+event.token;
	}
  });
}
