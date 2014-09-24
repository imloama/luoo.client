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
  


app.controller('IndexCtrl',function($scope,$location){
	$scope.wantMusic= '';//要看的期刊
	$scope.toMusic = function(){
		$location.path('/music/'+$scope.wantMusic).replace();
	}
});

app.controller('MusicCtrl',function($scope,$stateParams){
	alert($stateParams.id);//urlf地址中带的
});