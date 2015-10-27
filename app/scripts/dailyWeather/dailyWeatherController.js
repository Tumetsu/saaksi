"use strict";
angular.module('saaksiApp.dailyWeather')
    .controller('DailyWeatherCtrl', ['$scope', '$translatePartialLoader', 'apikeyService', 'fmiService',
        function ($scope, $translatePartialLoader, apikeyService, fmiService) {
            $translatePartialLoader.addPart('dailyweather');
            $scope.dateMinLimit = '1991/1/1';
            $scope.dateMaxLimit = '2018/07/14';
            $scope.defaultDate = new Date().toDateString();
            $scope.stations = null;
            $scope.selectedStation = null;
            fmiService.getStationMetadata('weather').then(function(response) {
                $scope.stations = response.data.data;
                console.log($scope.stations )
            });
        }]);
