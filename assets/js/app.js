/***
 * 落网客户端，数据采集自luoo.net
 * @author:itwarcraft@gmail.com
 */

var app = angular.module('luoo',['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    //首界面
    .state('index', {
      url: "/",
      templateUrl: "templates/home.html",
      controller: 'IndexCtrl'
    })
    /*
    //展示所有期刊，做分页处理过的  其中的参数Id表示分页的页码
    . state('musicpage', {
      url: "/musicpage/:id",
      templateUrl: "templates/musicpage.html",
      controller: 'MusicPageCtrl'
    })*/
    //具体某期刊的展示界面,链接到某个分页上
    .state('music', {
      url: "/music/:id",
      templateUrl: "templates/music.html",
      controller: 'MusicCtrl'
    });

  $urlRouterProvider.otherwise('/');
});
  app.config(['$httpProvider', function ($httpProvider) {
  //Reset headers to avoid OPTIONS request (aka preflight)
	  $httpProvider.defaults.headers.common = {};
	  $httpProvider.defaults.headers.post = {};
	  $httpProvider.defaults.headers.put = {};
	  $httpProvider.defaults.headers.patch = {};
}]);


app.controller('IndexCtrl',function($scope,$location){
	$scope.wantMusic= '';//要看的期刊
	$scope.toMusic = function(){
		$location.path('/music/'+$scope.wantMusic).replace();
	}
});

app.controller('MusicCtrl',function($scope,$stateParams,$http){
	var id = $stateParams.id;
	$http.jsonp('http://localhost:3001/music?callback=JSON_CALLBACK&id='+id)
		.success(function(data){
			var str = GibberishAES.dec(data.playlist,data.aes);
			var playlist = JSON.parse(str);
			//加载数据显示
			console.log(playlist);
			$scope.playlist = playlist;
			$scope.voltitle = data.voltitle;
			
		})
		.error(function(err){
			alert(err);
		});

	//下载全部
	$scope.downAll = function(playlist){
		var result = '{"title":"'+$scope.voltitle+'","playlist":'+JSON.stringify(playlist)+'}';
		var str = encodeURI(result);
		console.log(str);
		$http.jsonp('http://localhost:3001/downloadAll?callback=JSON_CALLBACK&vol='+str)
			.success(function(data){
				alert(data.msg);
			})
			.error(function(err){
				alert(err);
			});
	};

	$scope.downP = function(play){
		var titleStr= encodeURI($scope.voltitle);
		console.log("titleStr:"+titleStr);
		var mp3 = encodeURI(JSON.stringify(play));
		console.log("mp3:"+mp3);
		$http.jsonp('http://localhost:3001/downloadMp3?callback=JSON_CALLBACK&title='+titleStr+"&mp3="+mp3)
			.success(function(data){
				alert(data.msg);
			})
			.error(function(err){
				alert(err);
			});
	};
	
	$scope.playM = function(play){
		$scope.playMusic = play;
		var player = $("#playeraudio").attr("src",play.mp3).attr("autoplay","autoplay");
		player.bind("ended",function(){
			var c = 0;//当前播放的文件位于列表的位置
			for(var i=0;i<$scope.playlist.length;i++){
				if(player.attr("src")==$scope.playlist[i].mp3){
					c = i;
					break;
				}
			}
			if(c==$scope.playlist.length){
				c==-1;
			}
			$scope.playMusic = $scope.playlist[c+1];
			player.attr("src",$scope.playMusic.mp3).attr("autoplay","autoplay");
		});
	};
	
});