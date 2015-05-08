'use strict';

var projectApp = angular.module('projectApp', [
  'ngRoute',
  'projectControllers'
]);

projectApp.factory('Logger', function() {
  return {logs: []};
});

projectApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/search', {
        templateUrl: 'partials/search.html',
        controller: 'searchCtrl'
      }).
      when('/search/:logId', {
        templateUrl: 'partials/search.html',
        controller: 'searchCtrl'
      }).
      when('/log', {
        templateUrl: 'partials/searchLog.html',
        controller: 'searchLogCtrl'
      }).
      when('/distance', {
        templateUrl: 'partials/distance.html',
        controller: 'distanceCtrl'
      }).
      when('/saved', {
        templateUrl: 'partials/savedLocation.html',
        controller: 'savedCtrl'
      }).
      otherwise({
        redirectTo: '/search'
    });
  }]);