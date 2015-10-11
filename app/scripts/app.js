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
        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: '../i18n/{part}/{lang}.json'
        });

        $translateProvider
            .preferredLanguage('fi')
            .fallbackLanguage('en');
        //$translateProvider.determinePreferredLanguage();
        //$translateProvider.preferredLanguage('en');


        //
        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise("/");
        //
        // Now set up the states
        $stateProvider
            .state('dailyWeather', {
                url: '/dailyweather',
                templateUrl: 'partials/dailyweather.html',
                controller: 'DailyWeatherCtrl'
            })
            .state('dailyWeather.list', {
                url: 'list',
                templateUrl: 'partials/State1.list.html',
                controller: function($scope) {
                    $scope.items = ["A", "List", "Of", "Items"];
                }
            })
            .state('seaLevel', {
                url: "/sealevel",
                templateUrl: "partials/sealevel.html"
            })
            .state('sealevel.list', {
                url: "/list",
                templateUrl: "partials/state2.list.html",
                controller: function($scope) {
                    $scope.things = ["A", "Set", "Of", "Things"];
                }
            })
            .state('airQuality', {
                url: '/airquality',
                templateUrl: 'partials/airquality.html'
            })
            .state('airQuality.list', {
                url: 'list',
                templateUrl: 'partials/State1.list.html',
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
