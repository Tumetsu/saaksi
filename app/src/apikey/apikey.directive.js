'use strict';
angular.module('saaksiApp.apiKey')
.directive('apikeyInput', [function() {
    console.log("sdasds");
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'src/apikey/apikey-form.tpl.html',
        link: function (scope, element) {
            console.log("link!");
        }
    };
}]);

