jQuery.fn.extend({
	jeversiBoardWidget: function (proxy, initialEvents) {
		return this.each(
			function () {
				var widget = jQuery(this),
				buttons = widget.find(":button"),
				status = widget.find(".status"), token,
				nopStrategy = function (event) {
					console.log("No strategy for ", event);
				},
				eventStrategy = {
					init: function (event) {
						widget.find(".token").text(token = event.token);
					},
					start: function (event) {
						status.text("New game started");
						widget.find(":button").val("-");
					},
					take: function (event) {
						jQuery(buttons[8 * (event.row - 1) + event.column - 1])
							.fadeOut()
							.val(event.token[0])
							.fadeIn();
					},
					next: function (event) {
						status.text(event.token + " is next");
					},
					reject: function (event) {
						status.text("invalid move by " + event.token);
					},
					finish: function (event) {
						status.text("game over. winner:" + event.outcome + " " + Math.max(event.black, event.white) + ":" + Math.min(event.black, event.white));
					}
				},
				onEventReceived = function (event) {
					console.log("on" + event.type, event);
					(eventStrategy[event.type] || nopStrategy)(event);
				};
				eventStrategy.flip = eventStrategy.take;
				if (initialEvents) {
					initialEvents.forEach(onEventReceived);
				}
				proxy.addEventListener("EventReceived", onEventReceived);
				widget.click(function (event) {
					var element = jQuery(event.target),
					row = parseInt(element.attr("row"), 10),
					column = parseInt(element.attr("col"), 10);
					if (row && column) {
						proxy.place(token, row, column);
					}
				});
			}
		);
	}
});
