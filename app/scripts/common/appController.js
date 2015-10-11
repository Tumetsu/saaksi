angular.module('saaksiApp')
    .controller('AppCtrl', ['$scope', '$translate', function ($scope, $translate) {
        $scope.changeLanguage = function() {
            var lang = $translate.proposedLanguage() || $translate.use();
            if (lang === 'fi') {
                lang = 'en';
            } else if (lang === 'en') {
                lang = 'fi';
            }
            $translate.proposedLanguage() || $translate.use(lang);
        };
    }]);
