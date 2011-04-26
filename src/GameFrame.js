
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
	heading.innerHTML=token;
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
  controller.addEventListener("EventReceived",function(event){
	if (event.type=="take" || event.type=="flip"){
       		_buttons[key(event.row,event.column)].value=event.token[0];
	 }
	else if (event.type=="next"){
		_status.innerHTML=event.token + " is next";
	}
	else if (event.type=="reject"){
		_status.innerHTML="invalid move by "+event.token;
	}
	else if (event.type=="finish"){
		_status.innerHTML="game over. winner:"+event.token;
	}
	else if (event.type=="start"){
		clear();
		redraw();
	    _status.innerHTML="new game started";
	}
  });
}
