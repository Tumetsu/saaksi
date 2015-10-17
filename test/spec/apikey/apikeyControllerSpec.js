'use strict';

describe('ApikeyCtrl', function () {

    // load the controller's module
    beforeEach(module('saaksiApp'));
    beforeEach(module('saaksiApp.apiKey'));
    beforeEach(module('templates'));

    beforeEach(module(function ($stateProvider) {
        $stateProvider.state('A', { url: '/asd' });
    }));

    var ApikeyCtrl,
        $httpBackend,
        $q,
        scope,
        mockFmiService,
        mockApikeyService,
        mockRootScope,
        mockState;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, _$q_, _$httpBackend_) {
        scope = $rootScope.$new();
        $q = _$q_;
        $httpBackend = _$httpBackend_;

        //mocks
        mockFmiService = {
            validateApiKey: function () {}
        };
        mockApikeyService = {
            getStoredKey: function() {return 'apikey';},
            setKeyToStorage: function() {},
            removeApikey: function() {}
        };
        mockRootScope = {returnToState: null};
        mockState = {
            transitionTo: function (n) {mockState.current.name = n;},
            current: {
                name: ''
            }
        };



        //spies
        spyOn(mockApikeyService, 'getStoredKey').and.returnValue('apiKey');
        spyOn(mockApikeyService, 'setKeyToStorage');
        spyOn(mockApikeyService, 'removeApikey');

        ApikeyCtrl = $controller('ApikeyCtrl', {
            $scope: scope,
            // place here mocked dependencies
            fmiService: mockFmiService,
            apikeyService: mockApikeyService,
            $rootScope: mockRootScope,
            $state: mockState
        });

        $httpBackend.whenGET(/i18n.*/).respond(200, '');
    }));

    it('expect to get apiKey from service in beginning', function (done) {
        expect(mockApikeyService.getStoredKey.calls.count()).toBe(2);
        done();
    });

    describe('#setKey', function() {
        it('expect invalidKeyError to be false when validation succeeded', function (done) {
            //mock a successful validation
            spyOn(mockFmiService, 'validateApiKey').and.callFake(function() {
                var def = $q.defer();
                def.resolve({err: null, data: 'some data'});
                return def.promise;
            });

            scope.apikey = '1234';
            scope.setKey().then(function() {
                expect(mockFmiService.validateApiKey.calls.count()).toBe(1);
                expect(mockApikeyService.setKeyToStorage.calls.count()).toBe(1); //save key if validation succeeded
                expect(scope.invalidKeyError).toBe(false);
                done();
            });
            scope.$digest();
        });

        it('remove whitespace from apiKey', function (done) {
            //mock a successful validation
            spyOn(mockFmiService, 'validateApiKey').and.callFake(function() {
                var def = $q.defer();
                def.resolve({err: null, data: 'some data'});
                return def.promise;
            });

            scope.apikey = '12   34';
            scope.setKey().then(function() {
                expect(scope.apikey).toBe('1234');
                done();
            });
            scope.$digest();
        });

        it('expect invalidKeyError to be true when validation failed', function (done) {
            //mock a failed validation
            spyOn(mockFmiService, 'validateApiKey').and.callFake(function() {
                var def = $q.defer();
                def.resolve({err: 'some error', data: null});
                return def.promise;
            });

            scope.apikey = '1234';
            scope.setKey().then(function() {
                expect(mockFmiService.validateApiKey.calls.count()).toBe(1);
                expect(mockApikeyService.setKeyToStorage.calls.count()).toBe(0);    //do not save key if validation failed
                expect(scope.invalidKeyError).toBe(true);
                done();
            });
            scope.$digest();
        });
    });

    describe('#clearKey', function() {
        it('expect to clear the apikey', function (done) {
            //mock a successful validation
            spyOn(mockFmiService, 'validateApiKey').and.callFake(function () {
                var def = $q.defer();
                def.resolve({err: null, data: 'some data'});
                return def.promise;
            });

            scope.apikey = '1234';
            scope.setKey().then(function () {
                expect(mockApikeyService.setKeyToStorage.calls.count()).toBe(1); //save key if validation succeeded
                scope.clearKey();
                expect(mockApikeyService.removeApikey.calls.count()).toBe(1); //save key if validation succeeded
                done();
            });
            scope.$digest();
        });

    });

    describe('#redirect', function() {
        it('expect to redirect to app.download if no returnToState defined', function (done) {
            //test redirect through clearKey() function
            mockRootScope.returnToState = null;
            scope.clearKey();
            done();
        });

        it('expect to redirect to other state if returnToState is defined', function () {
            //test redirect through clearKey() function
            mockState.current.name = 'app.download.apikey';
            mockRootScope.returnToState = 'app.download.apikey';
            scope.clearKey();
            expect(mockState.current.name).toBe('app.download');
        });

        it('expect to redirect to other state if returnToState is defined', function () {
            //test redirect through clearKey() function
            mockRootScope.returnToState = 'A';
            scope.clearKey();
            expect(mockState.current.name).toBe('A');
        });

    });


});
