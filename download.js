var fs = require('fs')
  , path = require('path')
  , request = require('request')
  , progress = require('request-progress')
  , open = require('open')
  ;


var playlistStr = '';
var aesKey = '';
var volTitle = '';

var downloadDir = './music'
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir);
}
function getFm(fmUrl,func) {
  request(fmUrl, function (err, res, html) {
    playlistStr = findPlayList(html);//findContent(html, 'var pl = "', '";', 0);
	aseKey = findContent(html,'"aes":"','"}}',0);//密钥
	volTitle = findVolTitle(html);
	console.log(volTitle);
	//回调
	func(playlistStr,aseKey,volTitle);
   // playList = JSON.parse(p);
  });
}

function findContent(html, key, endTag, offset) {
  var start = html.indexOf(key);
  var end = html.indexOf(endTag, start);
  return html.substring(start+7, end + offset);
}

//获得加密的专辑列表
function findPlayList(html){
	var end = html.indexOf('}catch(e){}');
	var temp = html.substring(0,end);
	var start = temp.indexOf('try{');
	temp = temp.substring(start+4,temp.length).trim();
	var end2 = temp.indexOf('";');
	temp = temp.substring(0,end2).trim();
	var start2 = temp.indexOf('"');
	return temp.substring(start2+1,temp.length).trim();
}
//获得专辑名称
function findVolTitle(html){
	var start = html.indexOf("vol-title");
	var temp = html.substring(start+11,html.length);
	var end = temp.indexOf("</span>");
	var result = temp.substring(0,end);
	return result;
}


module.exports = {
	look4down:function(id,func){
		var answer = 'http://www.luoo.net/music/' + id;
		console.log(answer);
		getFm(answer,func);
	},
	getPlayListStr:function(){return playlistStr;},
	getAesKey:function(){return aesKey;},
	getVolTitle:function(){return volTitle;}
};

