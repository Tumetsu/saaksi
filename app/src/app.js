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
        'metolib',
        'moment',
        'pascalprecht.translate',
        'LocalStorageModule',
        '720kb.datepicker',
        'saaksiApp.dailyWeather',
        'saaksiApp.fmi',
        'pascalprecht.translate',
        'angucomplete-alt',
        'uiGmapgoogle-maps',
        'ngAnimate',
        'saaksiApp.apiKey'
    ])
    .config(function ($stateProvider, $translateProvider, $translatePartialLoaderProvider, $urlRouterProvider,
                      localStorageServiceProvider, uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            //    key: 'your api key',
            v: '3.20', //defaults to latest 3.X anyhow
            libraries: 'weather,geometry,visualization'
        });

        $translatePartialLoaderProvider.addPart('home');
        $translateProvider.useLocalStorage();
        $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: './i18n/{part}/{lang}.json'
        });
        $translateProvider
            .preferredLanguage('fi')
            .fallbackLanguage('en');

        localStorageServiceProvider
            .setPrefix('saaksi')
            .setStorageType('localStorage');



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

            .state('app.download.apikey', {
                url: '/apikey',
                templateUrl: 'src/apikey/apikey.html',
                controller: 'ApikeyCtrl'
            })

            .state('app.download.dailyWeather', {
                url: '/dailyweather',
                templateUrl: 'partials/download/dailyweather.html',
                controller: 'DailyWeatherCtrl',
                apikeyRequired: true
            })

            .state('app.download.seaLevel', {
                url: "/sealevel",
                templateUrl: "partials/download/sealevel.html",
                apikeyRequired: true
            })

            .state('app.download.airQuality', {
                url: '/airquality',
                templateUrl: 'partials/download/airquality.html',
                apikeyRequired: true
            });

    })
    .run(function ($rootScope, $state, $translate, apikeyService) {
        //listen translation changes and refresh them when new partials are loaded
        $rootScope.$on('$translatePartialLoaderStructureChanged', function () {
            $translate.refresh();
        });

        //redirections
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
            if (toState.apikeyRequired) {
                if (!apikeyService.getStoredKey()) {
                    $rootScope.returnToState = toState.name;
                    $state.transitionTo('app.download.apikey');
                    event.preventDefault();
                }
            }
        });
    });
