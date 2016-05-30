"use strict";
angular.module('saaksiApp')
.directive('languageSwitch', ['$translate', function ($translate) {
    return {
        restrict: 'E',
        template: '<a ng-click="changeLanguage()" translate>HOME.CHANGELANG</a>',
        replace: true,
        link: function (scope) {
            scope.changeLanguage = function () {
                var lang = $translate.proposedLanguage() || $translate.use();
                if (lang === 'fi') {
                    lang = 'en';
                } else {
                    lang = 'fi';
                }
                $translate.use(lang);
            };
        }
    };
}]);
