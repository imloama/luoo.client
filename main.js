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
		
	}else if(pathname=="/downloadAll"){
		//接收的是使用encodeuri的内容  使用 decodeURI()
		var params = querystring.parse(url.parse(req.url).query);
		var volStrDecode = params['vol'];
		var volStr = decodeURI(volStrDecode);
		console.log(volStr);
		var vol = JSON.parse(volStr);
		download.downloadAll(vol);
		//返回结果，表示提交成功
		var callback = params["callback"];
		var result = callback+'({code:1,msg:"提交成功！"})';
		res.writeHead(200, {'Content-Type': 'text/plain'});		
		res.end(result);
	
	}else if(pathname=="/downloadMp3"){
		console.log("-----------------333");
		var params = querystring.parse(url.parse(req.url).query);
		var titleStrDecode = params['title'];
		var mp3StrDecode = params['mp3'];
		//下载
		console.log(mp3StrDecode);
		var titleStr = decodeURI(titleStrDecode);
		var mp3Str = decodeURI(mp3StrDecode);
		console.log(titleStr);
		console.log(mp3Str);
		var mp3 = JSON.parse(mp3Str);
		download.downloadMp3(titleStr,mp3);
		var callback = params["callback"];
		var result = callback+'({code:1,msg:"提交成功！"})';
		res.writeHead(200, {'Content-Type': 'text/plain'});		
		res.end(result);
	}else{
		
	}

  
}).listen(port);

console.log("server started,listen on "+port);


