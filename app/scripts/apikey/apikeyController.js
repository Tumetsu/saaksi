"use strict";
angular.module('saaksiApp.apiKey')
    .controller('ApikeyCtrl', ['$scope', '$translatePartialLoader', 'apikeyService', function ($scope, $translatePartialLoader, apikeyService) {
        $translatePartialLoader.addPart('apikey');
        $scope.apikey = apikeyService.getStoredKey();
        $scope.invalidKeyError = false;

        $scope.setKey = function() {
            $scope.apikey = $scope.apikey.replace(/\s/g, '');
            apikeyService.setKeyToStorage($scope.apikey).then(function (result) {
                if (result.err) {
                    //TODO: Special error handling for other possible errors such as service being down etc.
                    //couldn't save the key
                    $scope.invalidKeyError = true;
                } else {
                    //key was saved, can continue
                    $scope.invalidKeyError = false;
                }
            });

        };
    }]);
