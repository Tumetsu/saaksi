"use strict";
angular.module('saaksiApp.apiKey')
    .service('apikeyService', ['localStorageService', function (localStorageService, metolibService) {

        this.getStoredKey = function() {
            return localStorageService.get('apikey');
        };

        this.setKeyToStorage = function(value) {
            localStorageService.set('apikey', value);
        };

    }]);
