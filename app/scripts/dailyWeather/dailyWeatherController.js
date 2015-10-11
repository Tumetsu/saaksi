"use strict";
angular.module('saaksiApp.dailyWeather')
    .controller('DailyWeatherCtrl', ['$scope', '$translatePartialLoader', function ($scope, $translatePartialLoader) {
        $translatePartialLoader.addPart('dailyweather');
        $scope.dateMinLimit = '1991/1/1';
        $scope.dateMaxLimit = '2018/07/14';
        $scope.defaultDate = new Date().toDateString();
    }]);
