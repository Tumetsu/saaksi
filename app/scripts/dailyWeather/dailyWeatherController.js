"use strict";
angular.module('saaksiApp.dailyWeather')
    .controller('DailyWeatherCtrl', ['$scope', '$translatePartialLoader', 'apikeyService', 'fmiService', 'uiGmapGoogleMapApi',
        function ($scope, $translatePartialLoader, apikeyService, fmiService, uiGmapGoogleMapApi) {
            $translatePartialLoader.addPart('dailyweather');

            $scope.defaultDate = new Date().toDateString();
            $scope.stations = null;
            $scope.selectedStation = null;
            $scope.stationMarker = {
                id: 'stationMarker'
            };

            $scope.selectedDataset = {
                begin: '1991/1/1',
                end: '1992/1/1'
            };

            fmiService.getStationMetadata('weather').then(function(response) {
                $scope.stations = response.data;
                $scope.dateMinLimit = '2011/1/1';
            });

            uiGmapGoogleMapApi.then(function(maps) {
            });

            $scope.setDateLimits = function() {
                if (!$scope.selectedDataset.end) {
                    $scope.selectedDataset.end = new Date().toDateString();
                }
            };


            $scope.$watch('selectedStation', function(newValue, oldValue) {
                if (newValue) {
                    $scope.map = {
                        center: {
                            latitude: parseFloat(newValue.originalObject.lat),
                            longitude: parseFloat(newValue.originalObject.lon)
                        },
                        zoom: 7
                    };
                    $scope.stationMarker = {
                        coords: {
                            latitude: parseFloat(newValue.originalObject.lat),
                            longitude: parseFloat(newValue.originalObject.lon),
                        },
                        id: 'stationMarker',
                        options: {}
                    }
                }

            });


        }]);
