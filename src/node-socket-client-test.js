var io=require("./ClientSocket");
var util=require("util");

var zeka=new io.Socket("localhost", {port:9999, debug:true});
zeka.on("connect",function(){
	var i=0;
	setInterval(function(){zeka.send("hej hej"+(i++));},5000);
});
zeka.on("message", function(msg){
	util.log("dobih: "+ msg);
});

