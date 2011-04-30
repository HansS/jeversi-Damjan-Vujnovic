/*global jeversi*/
jeversi.createRobot = function (game, strategy, initialEvents) {
	var events = initialEvents || [], token, processEvent = function (event) {
		var where;
		events.push(event);
		if (event.type === "init") {
			token = event.token;
		} else if ((event.type === "next" && event.token === token) || (event.type === "reject" && jeversi.next(events) === token)) {
			where = strategy(token, jeversi.createPositionIndex(events));
			setTimeout(function () {
				game.place(token, where.row, where.column);
			}, 100);
		}
	};
	events.forEach(processEvent);
	game.addEventListener("EventReceived", processEvent);
};

jeversi.firstFlippableStrategy = function (token, index) {
	var row, column;
	for (row = 1; row <= 8; row += 1) {
		for (column = 1; column <= 8; column += 1) {
			if (!index.get(row, column) && jeversi.getFlippableTokens(index, token, row, column).length) {
				return {
					row: row,
					column: column
				};
			}
		}
	}
};

jeversi.minUpToThresholdFlippableStrategy = function (threshold) {
	return function (token, index) {
		var isMin = index.size() < threshold,
		best = isMin ? 64 : 0,
		row, column, flippable, result;
		for (row = 1; row <= 8; row += 1) {
			for (column = 1; column <= 8; column += 1) {
				if (!index.get(row, column)) {
					flippable = jeversi.getFlippableTokens(index, token, row, column).length;
					if (flippable && (isMin ? flippable < best : flippable > best)) {
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
	};
};
