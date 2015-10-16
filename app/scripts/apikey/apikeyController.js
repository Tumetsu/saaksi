"use strict";
angular.module('saaksiApp.apiKey')
    .controller('ApikeyCtrl', ['$scope', '$translatePartialLoader', 'apikeyService', 'fmiService', function ($scope, $translatePartialLoader, apikeyService, fmiService) {
        $translatePartialLoader.addPart('apikey');
        $scope.apikey = apikeyService.getStoredKey();
        $scope.invalidKeyError = false;

        $scope.setKey = function() {
            $scope.apikey = $scope.apikey.replace(/\s/g, '');

            //validate the key by a call to FMI
            return fmiService.validateApiKey($scope.apikey).then(function(status) {
                if (status.err) {
                    //TODO: Special error handling for other possible errors such as service being down etc.
                    //couldn't save the key
                    $scope.invalidKeyError = true;
                } else {
                    //key is valid, save it to local storage
                    apikeyService.setKeyToStorage($scope.apikey);
                    $scope.invalidKeyError = false;
                }
            });

        };
    }]);
