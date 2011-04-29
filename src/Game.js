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
						resultchain.push(index[key(current_row,current_column)]);
						current_row = current_row + row_direction;
						current_column = current_column + column_direction;
					}
					return resultchain;
				},
				tokenMajority: function () {
					var majority = 0, key;
					for (key in index) {
						majority += index[key].token === "white" ? 1 : -1;
					}
					if (majority > 0) {
						return "white";
					}
					if (majority < 0) {
						return "black";
					}
					return "draw";
				}
			};
			if (events) {
				events.forEach(positionIndex.indexEvent);
			}
			return positionIndex;
		},
		createEvent: function (eventType, token, row, column) {
			var result = {
				type: eventType,
				token: token,
				row: row,
				column: column
			};
			return result;
		},
		next: function (events) {
			for (var i = events.length - 1; i >= 0; i--) {
				if (events[i].type === "next") {
					return events[i].token;
				}
			}
			throw new Error("Cannot determine next token");
		},
		flippable: function (events, token) {
			var result = [], i;
			for (i = 0; i < events.length; i++) {
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
			for (row_direction = -1; row_direction <= 1; row_direction++) {
				for (column_direction = -1; column_direction <= 1; column_direction++) {
					if (row_direction || column_direction) {
						var chain = index.chain(row, column, row_direction, column_direction);
						var flipInChain = jeversi.flippable(chain, token);
						result = result.concat(flipInChain);
					}
				}
			}
			return result;
		},
		createGame: function (size, events) {
			_boardSize = size || 8,
			_center = _boardSize / 2,
			_events = events || [],
			validPosition = function (row, column) {
				return row > 0 && column > 0 && row <= _boardSize && column <= _boardSize;
			},
			hasFlippable = function (token, index) {
				var row, column;
				for (row = 1; row <= _boardSize; row++) {
					for (column = 1; column <= _boardSize; column++) {
						if (!index.get(row, column) && jeversi.getFlippableTokens(index, token, row, column).length) {
							return true;
						}
					}
				}
				return false;
			},
			game = observable({
				getBoardSize: function () {
					return _boardSize;
				},
				pushEvent: function (event) {
					game.dispatchEvent("EventReceived", event);
					_events.push(event);
				},
				start: function () {
					[jeversi.createEvent("start"),
					jeversi.createEvent("take", "white", _center, _center),
					jeversi.createEvent("take", "white", _center + 1, _center + 1),
					jeversi.createEvent("take", "black", _center + 1, _center),
					jeversi.createEvent("take", "black", _center, _center + 1),
					jeversi.createEvent("next", "white")].forEach(game.pushEvent);
				},
				place: function (token, row, column) {
					var index = jeversi.createPositionIndex(_events),
					flippableTokens = jeversi.getFlippableTokens(index, token, row, column);
					if (!validPosition(row,column) || jeversi.next(_events) !== token || index.get(row,column) || !flippableTokens.length) {
						game.pushEvent(jeversi.createEvent("reject", token));
						return;
					}
					game.pushEvent(jeversi.createEvent("take", token, row, column));
					flippableTokens.forEach(function (toFlip) {
						game.pushEvent(jeversi.createEvent("flip", token, toFlip.row, toFlip.column));
					});
					index = jeversi.createPositionIndex(_events);
					if (hasFlippable(opposing(token), index)) {
						game.pushEvent(jeversi.createEvent("next", opposing(token)));
					} else if (hasFlippable(token, index)) {
						game.pushEvent(jeversi.createEvent("next", token));
					} else {
						game.pushEvent(jeversi.createEvent("finish", index.tokenMajority()));
					}
				}
			});
			return game;
		}
	};
	return jeversi;
})();
