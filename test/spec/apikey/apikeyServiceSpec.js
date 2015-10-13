'use strict';

describe('fmiService', function () {

    // load the module
    beforeEach(module('saaksiApp'));
    beforeEach(module('saaksiApp.apiKey'));

    var aService,
        $httpBackend,
        localStorage;

    // Initialize the service
    beforeEach(inject(function (apikeyService,  localStorageService, _$httpBackend_) {
        aService = apikeyService;
        $httpBackend = _$httpBackend_;
        localStorage = localStorageService;
        $httpBackend.whenGET(/i18n.*/).respond(200, '');
    }));

    afterEach(function() {
        localStorage.clearAll();    //clear keys saved during testing.
    });

    it('should exist', function () {
        expect(aService).toBeDefined();
    });

    describe('#getStoredKey', function() {

        it('return null if no key', function(done) {
            expect(aService.getStoredKey()).toBe(null);
            done();
        });

        it('return key if one exists', function(done) {
            //save test key
            localStorage.set('apikey', 'savedKey');
            expect(aService.getStoredKey()).toBe('savedKey');
            done();
        });
    });

    describe('#setKeyToStorage', function() {

        it('set the key into storage', function(done) {
            aService.setKeyToStorage('keyToBesaved');
            expect(localStorage.get('apikey')).toBe('keyToBesaved');
            done();
        });

    });

});
