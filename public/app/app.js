var app = angular.module("RoadWarriorApp", ['RoadWarriorCtrls', 'ui.router']);

app.config([
  '$stateProvider',
  '$urlRouterProvider',
  '$locationProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider){

  $urlRouterProvider.otherwise('/404');

  $stateProvider
  .state('home', {
    url: '/',
    templateUrl: 'app/views/today.html',
    controller: 'TodayCtrl'
  })
  .state('list', {
    url: '/list',
    templateUrl: 'app/views/list.html',
    controller: 'ListCtrl'
  })
  .state('otherDay', {
    url: '/listDay',
    templateUrl: 'app/views/listDay.html'
    controller: 'ListDayCtrl'
  })
  }



  ])

