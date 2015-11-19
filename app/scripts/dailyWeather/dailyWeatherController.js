'use strict';
angular.module('saaksiApp.dailyWeather')
    .controller('DailyWeatherCtrl', ['$scope', '$translatePartialLoader', 'apikeyService', 'fmiService', 'uiGmapGoogleMapApi', 'moment',
        function ($scope, $translatePartialLoader, apikeyService, fmiService, uiGmapGoogleMapApi, moment) {
            $translatePartialLoader.addPart('dailyweather');

            $scope.defaultDate = new Date().toDateString();
            $scope.stations = null;
            $scope.processStage = 0; //tells the stage of data input of user.
            $scope.selectedStation = null;
            $scope.stationMarker = {
                id: 'stationMarker'
            };

            function resetSelections() {
                $scope.selectedDataset = {
                    begin: '2014-04-25',
                    end: '2014-04-25'
                };

                $scope.dateRange = {
                    begin: null,
                    end: null,
                    error: {
                        begin: null,
                        end: null
                    }
                };
            }
            resetSelections();

            /**
             * Detects the stage of data input the user is in.
             * TODO: Refactor for better readability
             * @returns {number}
             */
            $scope.setProcessStage = function() {
                if (!$scope.selectedStation) {
                    $scope.processStage = 0;
                } else {
                    if (!$scope.selectedDataset.name) {
                        $scope.processStage = 1;
                    } else {
                        if ($scope.dateRange.error.begin || $scope.dateRange.error.end) {
                            $scope.processStage = 2;
                        } else {
                            $scope.processStage = 3;
                        }

                    }
                }
            };


            /**
             * Retrieve the json data of the stations.
             */
            fmiService.getStationMetadata('weather').then(function(response) {
                $scope.stations = response.data;
                $scope.dateMinLimit = '2011/1/1';
            });


            //Fill in the missing end date of the station, set to current date
            $scope.setDateLimits = function() {
                if (!$scope.selectedDataset.end) {
                    $scope.selectedDataset.end = new Date();
                }
            };

            /**
             * Validate the current date range set by user and set the required error messages
             * to be shown in UI.
             * @param dateRange
             * @returns {boolean}
             */
            $scope.validateDates = function(dateRange) {
                var beginDate = moment.utc(dateRange.begin, 'DD.MM.YYYY', true);
                var endDate = moment.utc(dateRange.end, 'DD.MM.YYYY', true);

                if (beginDate > endDate) {
                    dateRange.error.begin = 'Begin date should be smaller than end date';
                } else if (beginDate < moment.utc($scope.selectedDataset.begin)) {
                    dateRange.error.begin = 'Begin date should be bigger than earliest observation date';
                } else if (endDate > moment.utc($scope.selectedDataset.end)) {
                    dateRange.error.end = 'End date should not be bigger than the last observation date';
                } else {
                    dateRange.error.begin = null;
                    dateRange.error.end = null;
                }

                if (!beginDate.isValid()) {
                    dateRange.error.begin = 'Begin date is invalid';
                } else if (!endDate.isValid()) {
                    dateRange.error.end = 'End date is invalid';
                }

                $scope.setProcessStage();
            };

            /**
             * Observe when station is selected and map should be updated
             */
            $scope.$watch('selectedStation', function(newValue, oldValue) {
                if (newValue) {
                    resetSelections();
                    $scope.setProcessStage();
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
                            longitude: parseFloat(newValue.originalObject.lon)
                        },
                        id: 'stationMarker',
                        options: {}
                    };
                }

            });


        }]);
