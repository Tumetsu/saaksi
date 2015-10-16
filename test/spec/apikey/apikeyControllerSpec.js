'use strict';

describe('ApikeyCtrl', function () {

    // load the controller's module
    beforeEach(module('saaksiApp'));
    beforeEach(module('saaksiApp.apiKey'));

    var ApikeyCtrl,
        $httpBackend,
        $q,
        scope,
        mockFmiService,
        mockApikeyService;

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
            setKeyToStorage: function() {}
        };

        //spies
        spyOn(mockApikeyService, 'getStoredKey').and.returnValue('apiKey');
        spyOn(mockApikeyService, 'setKeyToStorage');

        ApikeyCtrl = $controller('ApikeyCtrl', {
            $scope: scope,
            // place here mocked dependencies
            fmiService: mockFmiService,
            apikeyService: mockApikeyService
        });

        $httpBackend.whenGET(/i18n.*/).respond(200, '');
    }));

    it('expect to get apiKey from service in beginning', function (done) {
        expect(mockApikeyService.getStoredKey.calls.count()).toBe(1);
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


});
