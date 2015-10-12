"use strict";
angular.module('saaksiApp.apiKey')
    .service('apikeyService', ['localStorageService', 'metolibService', function (localStorageService, metolibService) {

        this.getStoredKey = function() {
            return localStorageService.get('apikey');
        };

        this.setKeyToStorage = function(value) {

            return metolibService.validateApiKey(value).then(function(status) {
                if (!status.err) {
                    localStorageService.set('apikey', value);
                }
                return status;
            });


        };

        /**
         * Validate the given api-key using Metolib.
         */
        this.validateKey = function(key) {

        };

    }]);
