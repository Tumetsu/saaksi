"use strict";
angular.module('saaksiApp.apiKey')
    .service('apikeyService', ['localStorageService', function (localStorageService) {

        this.getStoredKey = function() {
            return localStorageService.get('apikey');
        };

        this.setKeyToStorage = function(value) {
            localStorageService.set('apikey', value);
        };

        this.removeApikey = function() {
            return localStorageService.remove('apikey');
        };

    }]);
