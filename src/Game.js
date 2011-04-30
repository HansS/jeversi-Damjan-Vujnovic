/*global console, observable*/
var jeversi = (function () {
	var opposing = function (token) {
		return token === "white" ? "black" : "white";
	},
	jeversi = {
		createPositionIndex: function (events) {
			var index = {},
			size = 0,
			key = function (row, column) {
				return row + "_" + column;
			},
			positionIndex = {
				size: function () {
					return size;
				},
				indexEvent: function (event) {
					if (event.row && event.column) {
						var k = key(event.row, event.column);
						size += index[k] ? 0 : 1;
						index[k] = event;
					}
				},
				get: function (row, column) {
					return index[key(row, column)];
				},
				chain: function (before_row, before_column, row_direction, column_direction) {
					var resultchain = [],
					current_row = before_row + row_direction,
					current_column = before_column + column_direction;
					while (index[key(current_row, current_column)]) {
						resultchain.push(index[key(current_row, current_column)]);
						current_row = current_row + row_direction;
						current_column = current_column + column_direction;
					}
					return resultchain;
				},
				countTokens: function () {
					var key, result = {
						black: 0,
						white: 0
					};
					for (key in index) {
						result[index[key].token] += 1;
					}
					return result;
				}
			};
			if (events) {
				events.forEach(positionIndex.indexEvent);
			}
			return positionIndex;
		},
		declareWinner: function (counts) {
			if (counts.white > counts.black) {
				return "white";
			}
			if (counts.black > counts.white) {
				return "black";
			}
			return "draw";
		},
		createEvent: function (eventType, token, row, column, finalResult) {
			var result = {
				type: eventType,
				token: token,
				row: row,
				column: column,
				finalResult: finalResult
			};
			return result;
		},
		next: function (events) {
			for (var i = events.length - 1; i >= 0; i -= 1) {
				if (events[i].type === "next") {
					return events[i].token;
				}
			}
			throw new Error("Cannot determine next token");
		},
		flippable: function (events, token) {
			var result = [], i;
			for (i = 0; i < events.length; i += 1) {
				if (events[i].token === opposing(token)) {
					result.push(events[i]);
				} else {
					return result;
				}
			}
			return [];
		},
		getFlippableTokens: function (index, token, row, column) {
			var result = [], row_direction, column_direction, chain, flipInChain;
			for (row_direction = -1; row_direction <= 1; row_direction += 1) {
				for (column_direction = -1; column_direction <= 1; column_direction += 1) {
					if (row_direction || column_direction) {
						chain = index.chain(row, column, row_direction, column_direction);
						flipInChain = jeversi.flippable(chain, token);
						result = result.concat(flipInChain);
					}
				}
			}
			return result;
		},
		createGame: function (size, initialEvents) {
			var boardSize = size || 8,
			center = boardSize / 2,
			events = initialEvents || [],
			validPosition = function (row, column) {
				return row > 0 && column > 0 && row <= boardSize && column <= boardSize;
			},
			hasFlippable = function (token, index) {
				var row, column;
				for (row = 1; row <= boardSize; row += 1) {
					for (column = 1; column <= boardSize; column += 1) {
						if (!index.get(row, column) && jeversi.getFlippableTokens(index, token, row, column).length) {
							return true;
						}
					}
				}
				return false;
			},
			game = observable({
				getBoardSize: function () {
					return boardSize;
				},
				pushEvent: function (event) {
					game.dispatchEvent("EventReceived", event);
					events.push(event);
				},
				start: function () {
					[jeversi.createEvent("start"),
					jeversi.createEvent("take", "white", center, center),
					jeversi.createEvent("take", "white", center + 1, center + 1),
					jeversi.createEvent("take", "black", center + 1, center),
					jeversi.createEvent("take", "black", center, center + 1),
					jeversi.createEvent("next", "white")].forEach(game.pushEvent);
				},
				place: function (token, row, column) {
					console.log(token, row, column);
					var index = jeversi.createPositionIndex(events), tokenCounts,
					flippableTokens = jeversi.getFlippableTokens(index, token, row, column);
					if (!validPosition(row, column) || jeversi.next(events) !== token || index.get(row, column) || !flippableTokens.length) {
						game.pushEvent(jeversi.createEvent("reject", token));
						return;
					}
					game.pushEvent(jeversi.createEvent("take", token, row, column));
					flippableTokens.forEach(function (toFlip) {
						game.pushEvent(jeversi.createEvent("flip", token, toFlip.row, toFlip.column));
					});
					index = jeversi.createPositionIndex(events);
					if (hasFlippable(opposing(token), index)) {
						game.pushEvent(jeversi.createEvent("next", opposing(token)));
					} else if (hasFlippable(token, index)) {
						game.pushEvent(jeversi.createEvent("next", token));
					} else {
						tokenCounts = index.countTokens();
						game.pushEvent({
							type: "finish",
							white: tokenCounts.white,
							black: tokenCounts.black,
							outcome: jeversi.declareWinner(tokenCounts)
						});
					}
				}
			});
			return game;
		}
	};
	return jeversi;
})();
