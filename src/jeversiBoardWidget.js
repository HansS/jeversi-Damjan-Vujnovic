jQuery.fn.extend({
	jeversiBoardWidget: function (proxy) {
		return this.each(
			function () {
				var widget = jQuery(this), status = widget.find(".status"), token,
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
						jQuery(widget.find(":button")[8 * (event.row - 1) + event.column - 1]).val(event.token[0]);
					},
					next: function (event) {
						status.text(event.token + " is next");
					},
					reject: function (event) {
						status.text("invalid move by " + event.token);
					},
					finish: function (event) {
						status.text("game over. winner:" + event.token);
					}
				};
				eventStrategy.flip = eventStrategy.take;
				proxy.addEventListener("EventReceived", function (event) {
					console.log("on" + event.type, event);
					(eventStrategy[event.type] || nopStrategy)(event);
				});
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
