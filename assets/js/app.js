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
    //展示所有期刊，做分页处理过的  其中的参数Id表示分页的页码
    . state('musicpage', {
      url: "/musicpage/:id",
      templateUrl: "templates/musicpage.html",
      controller: 'MusicPageCtrl'
    })
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
			
			
		})
		.error(function(err){
			alert(err);
		});

	//下载全部
	$scope.downAll = function(playlist){
		alert("all");
	};

	$scope.downP = function(play){
		alert("down");
	};
	
	$scope.playM = function(play){
		alert("playM");	
		console.log(play);
		alert(play.mp3);
		$("#player").attr("src",play.mp3).attr("autoplay","autoplay");
	};
	
});