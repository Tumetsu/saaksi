"use strict";
angular.module('saaksiApp.fmi')
    .service('fmiService', ['$window', '$http', '$q', 'metolib', function ($window, $http, $q, metolib) {
        var connection = new metolib.WfsConnection();

        /**
         * Makes a test query to FMI's service with provided API key and returns the response.
         * @param key
         * @returns {*}
         */
        this.validateApiKey = function(key) {
            var def = $q.defer();
            $http({
                url: 'http://data.fmi.fi/fmi-apikey/' + key + '/wfs',
                method: 'GET',
                params: {
                    request: 'getCapabilities'
                }
            })
                .then(function(data) {
                    def.resolve({err: null, data: data});
                }, function(err) {
                    def.resolve({err: err, data: null});
                });

            return def.promise;
        };

        /**
         * Makes a regular http-request without Metolib.
         * @param params
         * @returns {*}
         */
        this.regularHttpRequest = function(key, params) {
            var def = $q.defer();
            $http({
                url: 'http://data.fmi.fi/fmi-apikey/' + key + '/wfs',
                method: 'GET',
                params: {
                    request: 'getCapabilities'
                }
            })
                .then(function(data) {
                    def.resolve({err: null, data: data});
                }, function(err) {
                    def.resolve({err: err, data: null});
                });

            return def.promise;
        };



        //TODO: Example for now.
        /*
        this.exampleQuery = function(key) {
            var url = 'http://data.fmi.fi/fmi-apikey/' + key + '/wfs';
            var storedQuery = 'fmi::observations::weather::multipointcoverage';
            var ce = connection.connect(url, storedQuery);
            if (ce) {
                connection.getData({
                    requestParameter: 'td',
                    begin : new Date(1368172800000),
                    end : new Date(1368352800000),
                    timestep : 60 * 60 * 1000,
                    sites : "Helsinki",
                    callback: function(data, errors) {
                        console.log("data", data, "errors ", errors);
                        // Disconnect because the flow has finished.
                        connection.disconnect();
                    }
                });
            }
        };
        */
    }]);
