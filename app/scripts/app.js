'use strict';
//$(document).foundation();     //Problem with Karma tests.
/**
 * @ngdoc overview
 * @name weatherdownloaderApp
 * @description
 * # weatherdownloaderApp
 *
 * Main module of the application.
 */
angular
    .module('saaksiApp', [
        'ngAnimate',
        'ngAria',
        'ngCookies',
        'ngMessages',
        'ngResource',
        'ngSanitize',
        'ngTouch',
        'ui.router',
        'mm.foundation',
        'lodash',
        '720kb.datepicker',
        'saaksiApp.dailyWeather',
        'pascalprecht.translate'
    ])
    .config(function ($stateProvider, $translateProvider, $translatePartialLoaderProvider, $urlRouterProvider) {
        $translatePartialLoaderProvider.addPart('home');
        $translateProvider.useLocalStorage();
        $translateProvider.useSanitizeValueStrategy('sanitize');
        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: './i18n/{part}/{lang}.json'
        });

        $translateProvider
            .preferredLanguage('fi')
            .fallbackLanguage('en');
        //$translateProvider.determinePreferredLanguage();
        //$translateProvider.preferredLanguage('en');


        //
        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise("");
        //
        // Now set up the states
        $stateProvider
            .state('app', {
                templateUrl: 'views/app.html',
                controller: 'AppCtrl'
            })

            .state('app.download', {
                url: '',
                templateUrl: 'views/download/download.html'
            })

            .state('app.download.dailyWeather', {
                url: '/dailyweather',
                templateUrl: 'partials/download/dailyweather.html',
                controller: 'DailyWeatherCtrl'
            })
            .state('app.download.dailyWeather.list', {
                url: 'list',
                templateUrl: 'partials/download/State1.list.html',
                controller: function($scope) {
                    $scope.items = ["A", "List", "Of", "Items"];
                }
            })
            .state('app.download.seaLevel', {
                url: "/sealevel",
                templateUrl: "partials/download/sealevel.html"
            })
            .state('app.download.sealevel.list', {
                url: "/list",
                templateUrl: "partials/download/state2.list.html",
                controller: function($scope) {
                    $scope.things = ["A", "Set", "Of", "Things"];
                }
            })
            .state('app.download.airQuality', {
                url: '/airquality',
                templateUrl: 'partials/download/airquality.html'
            })
            .state('app.download.airQuality.list', {
                url: 'list',
                templateUrl: 'partials/download/State1.list.html',
                controller: function($scope) {
                    $scope.items = ["A", "List", "Of", "Items"];
                }
            });
    })
    .run(function ($rootScope, $translate) {
        //listen translation changes and refresh them when new partials are loaded
        $rootScope.$on('$translatePartialLoaderStructureChanged', function () {
            $translate.refresh();
        });
    });
