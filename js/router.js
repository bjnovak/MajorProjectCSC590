'use strict';

var projectApp = angular.module('projectApp', [
  'ngRoute',
  'projectControllers'
]);

projectApp.factory('Logger', function() {
  if (typeof(Storage) !== "undefined") {
    if (localStorage["logged"])
      return {logs: JSON.parse(localStorage["logged"])};
    else
      return {logs: []};
  }
  else
    console.log("Browser doesn't support Storage.");

  return {logs: []};
});

projectApp.factory('Saved', function() {
  if (typeof(Storage) !== "undefined") {
    if (localStorage["saved"])
      return {saved: JSON.parse(localStorage["saved"])};
    else
      return {saved: []};
  }
  else
    console.log("Browser doesn't support Storage.");

  return {saved: []};
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
        templateUrl: 'partials/log.html',
        controller: 'logCtrl'
      }).
      when('/distance', {
        templateUrl: 'partials/distance.html',
        controller: 'distanceCtrl'
      }).
      when('/saved', {
        templateUrl: 'partials/saved.html',
        controller: 'savedCtrl'
      }).
      otherwise({
        redirectTo: '/search'
    });
  }]);