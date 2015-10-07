"use strict";
angular.module('saaksiApp.metolib')
    .service('metolibService', ['$window', function ($window) {
        var connection = new $window.fi.fmi.metoclient.metolib.WfsConnection();
    }]);
