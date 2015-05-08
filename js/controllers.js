'use strict';

var projectControllers = angular.module('projectControllers', []);

projectControllers.controller('searchCtrl', ['$scope', '$http', '$routeParams', 'Logger', 'Saved',
	function($scope, $http, $routeParams, Logger, Saved) {

		// get the Geocoder objects based off of the users search query
		var geocoder = new google.maps.Geocoder();
		$scope.getLatLon = function() {
			if (Logger.logs.indexOf($scope.query) == -1) {
				$scope.logData();
			}

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

		$scope.logData = function() {
			if (typeof(Storage) !== "undefined") {
				if (!localStorage["logged"]) {
					localStorage["logged"] = JSON.stringify([$scope.query]);
				}
				else {
					var temp = JSON.parse(localStorage["logged"]);
					var pushIt = true;

					temp.forEach(function(obj) {
						if (obj == $scope.query)
							pushIt = false;
					});

					if (pushIt) {
						temp.push($scope.query);
						Logger.logs = temp;
						localStorage["logged"] = JSON.stringify(temp);
					}
				}
			}
			else {
				console.log("Browser doesn't support Storage.");
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
						if (obj.formatted_address == $scope.results[result].formatted_address)
							pushIt = false;
					});

					if (pushIt) {
						temp.push($scope.results[result]);
						Saved.saved = temp;
						localStorage["saved"] = JSON.stringify(temp);
					}

					$scope.results.splice(result, 1);
				}
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

projectControllers.controller('logCtrl', ['$scope', 'Logger',
	function($scope, Logger) {
		$scope.logs = Logger.logs;

		$scope.clearData = function() {
			localStorage.removeItem("logged");
			$scope.logs = [];
			Logger.logs = [];
		};
	}]);

projectControllers.controller('savedCtrl', ['$scope', 'Saved',
	function($scope, Saved) {
		$scope.saved = Saved.saved;

		$scope.clearData = function() {
			localStorage.removeItem("saved");
			$scope.saved = [];
			Saved.saved = [];
		};
	}]);

projectControllers.controller('distanceCtrl', ['$scope', 'Saved',
	function($scope, Saved) {
		$scope.saved = Saved.saved;
		$scope.dist = "null";

		$scope.getDist = function() {
			var l1 = Number($scope.lat1) * (Math.PI/180);
			var l2 = Number($scope.lat2) * (Math.PI/180);
			var lat = (Number($scope.lat2)-Number($scope.lat1)) * (Math.PI/180);
			var lon = (Number($scope.lon2)-Number($scope.lon1)) * (Math.PI/180);

			var a = Math.sin(lat/2) * Math.sin(lat/2) + Math.cos(l1) * Math.cos(l2) * Math.sin(lon/2) * Math.sin(lon/2);
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

			var result = (6371 * c) * 0.621371;
			result.toFixed(2);
			$scope.dist = result.toFixed(2);
		};

	}]);