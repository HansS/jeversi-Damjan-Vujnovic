jeversi.drawBoard = function (element, rows, columns) {
	rows = rows || 8;
	columns = columns || 8;
	var heading=document.createElement("h1");
	heading.className = "token";
	element.appendChild(heading);
	var _status=document.createElement("span");
	_status.className = "status";
	element.appendChild(_status);
	element.appendChild(document.createElement("br"));
	var table=document.createElement("table");
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
			button.row = row;
			button.col = column;
		}
	}
	element.appendChild(table);
}
