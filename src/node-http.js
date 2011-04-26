var http = require("http");

http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write("Hello World");
  response.end();
  console.log("new request "+ request.url);
}).listen(8888);
