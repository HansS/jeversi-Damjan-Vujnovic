jeversi.createRobot = function (game, token,strategy) {
	var _events=[];
	game.addEventListener("EventReceived", function (event) {
		_events.push(event);
		if ((event.type==="next" && event.token===token) ||(event.type==="reject" && jeversi.next(_events)===token)){
			var where=strategy(token,jeversi.createPositionIndex(_events));
			setTimeout(function () {
				game.place(token, where.row, where.column);
			}, 100);
		}
	});
};

jeversi.firstFlippableStrategy=function (token,index) {
	for (var row=1; row<=8; row++) {
		for (var column=1; column<=8; column++)
		 	if (!index.get(row, column) && jeversi.getFlippableTokens(index,token,row,column).length)
				return {
					row: row,
					column:column
				};
	}
}

jeversi.minUpToThresholdFlippableStrategy = function (threshold) {
	return function (token, index) {
		var isMin = index.size() < threshold;
		var best = isMin ? 64 : 0;
		for (var row = 1; row <= 8; row++) {
			for (var column = 1; column <= 8; column++) {
				if (!index.get(row, column)) {
					var flippable = jeversi.getFlippableTokens(index, token, row, column).length;
					if (flippable > 0 && (isMin ? flippable < best : flippable > best)) {
						result = {
							row: row,
							column: column
						};
						best = flippable;
					}
				}
			}
		}
		return result;
	}
}
