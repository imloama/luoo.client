

var fs = require('fs')
  , path = require('path')
  , request = require('request')
  , progress = require('request-progress')
  //, ProgressBar = require('progress')
  , open = require('open')
  ;
  //, colors = require('colors')
 // , List = require('term-list');


var currFm = '';
var playList = null;
var isDownloading = -1;   // which music is downloading
// make download dir if not exists
var downloadDir = './music'
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir);
}

function getFm(fmUrl) {
  console.log('正在获取期刊信息...'.yellow);
  request(fmUrl, function (err, res, html) {
	console.log("得到结果");
    var p = findContent(html, 'var volPlaylist = ', '}];', 2);
    console.log(p);
    // parse fm info and make music dir
    playList = JSON.parse(p);
    var fmTitle = findContent(html, '<h1 class="fm-title">', '</h1>', 0);
    currFm = fmTitle;
    var fmIntro = findContent(html, '<p class="fm-intro">', '</p>', 0);
    var fmCover = 'http://img' + findContent(html, 'http://img', '"', 0);
    var fmPath = path.join(downloadDir, fmTitle);
    var introPath = path.join(downloadDir, fmTitle, fmTitle + '.txt');
    var coverPath = path.join(downloadDir, fmTitle, fmTitle + '.jpg')

	return {'fmTitle':fmTitle
			,'fmIntro':fmIntro
			,'fmCover':fmCover
			,'fmPath':fmPath
			,'introPath':introPath
			,'coverPath':coverPath
			,'playList':playList
			};
	
	/*
    if (!fs.existsSync(fmPath)) {
      fs.mkdirSync(fmPath);
      fs.writeFile(introPath, fmIntro.replace(/<br>/g, '\r\n').trim());
      request(fmCover).pipe(fs.createWriteStream(coverPath));
    }*/
    //setMenuInfo();
  });
}

function findContent(html, key, endTag, offset) {
  var start = html.indexOf(key);
  var end = html.indexOf(endTag, start);
  return html.substring(start + key.length, end + offset);
}


function downloadMP3(mp3Info) {
  var coverFile = path.join(downloadDir, currFm, mp3Info.title + '.jpg');
  request(mp3Info.poster).pipe(fs.createWriteStream(coverFile));

  var mp3File = path.join(downloadDir, currFm, mp3Info.title + '.mp3');
  if (!fs.existsSync(mp3File)) {
    var lastReceived = 0;
    progress(request(mp3Info.mp3))
    .on('progress', function (state) {
      isDownloading = mp3Info.id;
      //bar.total = state.total;
      //bar.tick(state.received - lastReceived, {title: mp3Info.title});
      lastReceived = state.received;
    })
    .pipe(fs.createWriteStream(mp3File))
    .on('close', function (err) {
      // download ended, reset bar state
      //bar.tick(bar.total - bar.curr);
      //bar.curr = 0;
      isDownloading = -1;
    });
  } else {
    //open(mp3File);
  }

}

function setError(err) {
  console.log(err.red);
}


//根据期刊主键下载数据，返回获得的json数据，并添加要保存的地址
exports.look4down = function(id){
	var answer = 'http://www.luoo.net/music/' + id;
	return getFm(answer);
}