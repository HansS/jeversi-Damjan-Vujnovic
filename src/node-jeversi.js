/*global require*/
var http = require('http');  
var io = require('socket.io');
var nodeStatic = require('node-static');
var file = new(nodeStatic.Server)('.');
var server = http.createServer(function(req, res){ 
 console.log("http request:" + req.url);
 
 req.addListener('end', function () {
        file.serve(req, res);
 });
});
server.listen(8888);

// socket.io 
	
var startGame=function(white,black){
	console.log("starting game");
	var game=jeversi.createGame();
	jeversi.createReverseProxy(game,"white",white);
	jeversi.createReverseProxy(game,"black",black);
	game.start();
}
var waiting;
var socket = io.listen(server); 
socket.on('connection', function(client){
  console.log("client connect" );
  if (waiting){
	  startGame(waiting, client);
	  waiting=null;
  } else
	  waiting = client;
   
  client.on('disconnect', function(){ console.log("client disconnect");}) 
}); 
