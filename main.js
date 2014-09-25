/***
 * 给前台界面提供json数据服务
 */
 
var http = require('http'),
	url = require("url"),
    path = require("path"),
    querystring = require("querystring");
var port = 3001;
var download = require('./download.js');

http.createServer(function (req, res) {
	var pathname = url.parse(req.url).pathname;
	console.log("request for url:"+pathname);
	if(pathname=="/music"){
		var id = querystring.parse(url.parse(req.url).query)['id'];
		var callback = querystring.parse(url.parse(req.url).query)['callback'];
		download.look4down(id,function(p,a,voltitle){
			var result = callback+'({"playlist":"'+p+'","aes":"'+a+'","voltitle":"'+voltitle+'"})';
			console.log(result);
			res.writeHead(200, {'Content-Type': 'text/plain'});		
			res.end(result);
		});
		
	}else{
		
	}

  
}).listen(port);

console.log("server started,listen on "+port);


