var http = require('http');  
var io = require('socket.io');
var static = require('node-static');
var file = new(static.Server)('.');

var server = http.createServer(function(req, res){ 
 console.log("http request:" + req.url); 
 req.addListener('end', function () {
        file.serve(req, res);
 });
});
server.listen(8888);

// socket.io 
var socket = io.listen(server); 
socket.on('connection', function(client){
  console.log("client connect" ); 
  // new client is here! 
  client.on('message', function(message){ 
	console.log("client message:" + message);
        client.send("reply to:"+message);
  }); 
  client.on('disconnect', function(){ console.log("client disconnect");}) 
}); 
