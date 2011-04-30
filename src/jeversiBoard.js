/*global jeversi*/
jeversi.drawBoard = function (element, rows, columns) {
	var heading = document.createElement("h1"),
	status = document.createElement("span"),
	table = document.createElement("table"),
	row, column, tableRow, tableColumn, button;
	heading.className = "token";
	element.appendChild(heading);
	status.className = "status";
	element.appendChild(status);
	element.appendChild(document.createElement("br"));
	for (row = 1; row <= (rows || 8); row += 1) {
		tableRow = document.createElement("tr");
		table.appendChild(tableRow);
		for (column = 1; column <= (columns || 8); column += 1) {
			tableColumn = document.createElement("td");
			tableRow.appendChild(tableColumn);
			button = document.createElement("input");
			button.type = "button";
			tableColumn.appendChild(button);
			button.value = "-";
			button.row = row;
			button.col = column;
		}
	}
	element.appendChild(table);
};
