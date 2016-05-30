'use strict';
angular.module('saaksiApp.apiKey')
.directive('apikeyValidator', ['fmiService', function(fmiService) {
    return {
        require : 'ngModel',
        restrict: 'A',
        link: function (scope, element, attrs, ngModel) {
            ngModel.$validators.keyFormat = function (apikey) {
                return /^([a-z0-9-]){25,}$/.test(apikey);
            };
        }
    };
}]);

