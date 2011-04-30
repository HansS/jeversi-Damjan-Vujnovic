var http = require('http');  
var io = require('socket.io');

var server = http.createServer(function(req, res){ 

});
server.listen(9999);

var socket = io.listen(server); 
socket.on('connection', function(client){
  console.log("client connect" ); 
  client.on('message', function(message){ 
	console.log("client message:" + message);
     client.send("reply to:"+message);
  }); 
  client.on('disconnect', function(){ console.log("client disconnect");}) 
}); 
