var utils = require('/usr/local/lib/node/.npm/socket.io/0.6.17/package/lib/socket.io/utils'),
WebSocket = require('/usr/local/lib/node/.npm/socket.io/0.6.17/package/support/node-websocket-client/lib/websocket').WebSocket;

x=function(){
  var _heartbeats = 0;
  var socket;
  function heartBeat() {
    socket.send('~h~' + ++ _heartbeats);
  }
 socket=new WebSocket('ws://localhost:9999/socket.io/websocket', 'borf');
 socket.onopen = function(){ console.log("socket open");
   for (var i=0; i<5; i++){
socket.send(utils.encode("zdravo deda"+i));

 } };
 messages=0;
 socket.onmessage = function (event) {
    var rawmsg = utils.decode(event.data)[0],
        frame = rawmsg.substr(0, 3),
        msg;        
    console.log('raw', rawmsg);
    messages++;
    if (messages==6)    process.exit();
    switch (frame){
      case '~h~':
        return heartBeat();
      case '~j~':
        msg = JSON.parse(rawmsg.substr(3));
        break;
    }
    if (msg !== undefined) {
      console.log('message', msg);
    };
};
};

x();