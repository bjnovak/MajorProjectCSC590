'use strict';

var projectControllers = angular.module('projectControllers', []);

projectControllers.controller('searchCtrl', ['$scope', '$http', '$routeParams', 'Logger',
	function($scope, $http, $routeParams, Logger) {

		// get the Geocoder objects based off of the users search query
		var geocoder = new google.maps.Geocoder();
		$scope.getLatLon = function() {
			if (Logger.logs.indexOf($scope.query) == -1)
				Logger.logs.push($scope.query);

			if ($scope.query) {
				geocoder.geocode({'address': $scope.query}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						$scope.results = results;
						$scope.$apply();
					} else {
						console.log("Failed to get geocode results.");
					}
				});
			}
		};

		// allow the user to press the ENTER key instead of clicking the SEARCH button
		$scope.enter = function(event) {
			if (event.which == 13) {
				$scope.getLatLon();
			}
		};

		$scope.save = function(result) { 
			if (typeof(Storage) !== "undefined") {
				if (!localStorage["saved"]) {
					localStorage["saved"] = JSON.stringify([$scope.results[result]]);
				}
				else {
					var temp = JSON.parse(localStorage["saved"]);

					var pushIt = true;
					temp.forEach(function(obj) {
						console.log(obj.formatted_address + " !!!! " + $scope.results[result].formatted_address);
						if (obj.formatted_address == $scope.results[result].formatted_address)
							pushIt = false;
					});

					if (pushIt) {
						temp.push($scope.results[result]);
						localStorage["saved"] = JSON.stringify(temp);
					}
				}

				console.log(JSON.parse(localStorage["saved"]));
			}
			else {
				console.log("Browser doesn't support Storage.");
			}
		};

		// Load the most recent search query results
		if (Logger.logs.length > 0) {
			$scope.query = Logger.logs[Logger.logs.length-1];
			$scope.getLatLon();
		}

		// allows user to add the search query to the URL
		if ($routeParams.logId) {
			$scope.query = $routeParams.logId;
			$scope.getLatLon();
		}
	}]);

projectControllers.controller('searchLogCtrl', ['$scope', 'Logger',
	function($scope, Logger) {
		$scope.logs = Logger.logs;
		console.log(Logger.logs);
	}]);

projectControllers.controller('savedCtrl', ['$scope',
	function($scope) {
		$scope.saved = JSON.parse(localStorage["saved"]);
		console.log($scope.saved);
	}]);