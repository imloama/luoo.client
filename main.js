/***
 * 给前台界面提供json数据服务
 */

 
var http = require('http'),
	url = require("url"),
    path = require("path"),
    querystring = require("querystring"),
    download = require("./download");

var port = 3001;


http.createServer(function (req, res) {
	var pathname = url.parse(req.url).pathname;
	console.log("request for url:"+pathname);
	if(pathname=="/music"){
		//var name=querystring.parse(url.parse(req.url).query)['name'];
		var id = querystring.parse(url.parse(req.url).query)['id'];
		var result = download.look4down(id);
		console.log(result);
		res.writeHead(200, {'Content-Type': 'application/json'});		
		res.end(result);
	}else{
		
	}
	
	
  
}).listen(port);

console.log("server started,listen on "+port);