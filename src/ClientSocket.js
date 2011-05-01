var socket_io_base=require.resolve('socket.io').split("/");
socket_io_base.pop();
var socket_io_base_url=socket_io_base.join("/");
var util = require("util");
var ioutils = require(socket_io_base_url+'/lib/socket.io/utils'),
WebSocket = require(socket_io_base_url+'/support/node-websocket-client/lib/websocket').WebSocket;

var EventEmitter = require('events').EventEmitter,
Socket = function (host, options) {
    var url = 'ws://' + host + ':' + options.port + '/socket.io/websocket';
    var open = false;
    var self = this;
    var debug=options.debug;
  	var _heartbeats = 0;
	var socket;
	function heartBeat(hb) {
		setTimeout(function () {
			if (debug) {
				util.log("sending heartbeat");
			}
			socket.send(ioutils.encode('~h~' + hb));
		}, 5000);
	};
	socket=new WebSocket(url, 'borf');
	socket.onopen = function () {
		open=true;
		self.emit('connect');
	};
	socket.onclose = function () {
		self.emit('disconnect');
		open = false;
	};
	var session_id;
	socket.onmessage = function (event) {
		if (debug) { util.log("received:"+event);}
		var rawmsg = ioutils.decode(event.data)[0],
		frame = rawmsg.substr(0, 3);
		if (!session_id) {
			session_id=rawmsg;
		}
		else if (frame==='~h~'){
			heartBeat(rawmsg.substr(3));
		}
		else {
			try{
				self.emit('message', JSON.parse(rawmsg.substring(3)));
			}
			catch (e){
				self.emit('message', rawmsg);
			}
		}
	};
	this.send=function(msg){
		if (debug)
			util.log("sending" + msg);
		socket.send(ioutils.encode(msg));
	}
};


Socket.prototype = new EventEmitter;
exports.Socket=Socket;
