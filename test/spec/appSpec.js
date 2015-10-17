'use strict';

describe('app', function () {

    // load the module
    beforeEach(module('saaksiApp'));
    beforeEach(module('templates'));

    var $rootScope,
        $httpBackend,
        $state,
        localStorage;

    // Initialize the service
    beforeEach(inject(function (_$httpBackend_, _$rootScope_, _$state_, localStorageService) {
        $state = _$state_;
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        localStorage = localStorageService;
        $httpBackend.whenGET(/i18n.*/).respond(200, '');
    }));

    describe('redirections based on apikey', function() {
        it('should redirect to /apikey when apikey is not set', function () {
            var toState = {
                apikeyRequired: true,
                name: 'app.download.dailyWeather'
            };
            $rootScope.$broadcast("$stateChangeStart", toState, null);
            $rootScope.$apply();
            expect($state.current.name).toBe('app.download.apikey');
        });

        it('should not redirect when apikey is set', function () {
            localStorage.set('apikey', 'savedKey');
            var toState = {
                apikeyRequired: true,
                name: 'app.download'
            };
            $rootScope.$broadcast("$stateChangeStart", toState, null);
            $rootScope.$apply();
            expect($state.current.name).toBe('app.download');
            localStorage.clearAll();
        });
    });





});
