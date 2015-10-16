'use strict';

describe('fmiService', function () {

    // load the module
    beforeEach(module('saaksiApp'));
    beforeEach(module('saaksiApp.fmi'));

    var fService,
        $httpBackend;

    // Initialize the service
    beforeEach(inject(function (fmiService,  _$httpBackend_) {
        fService = fmiService;
        $httpBackend = _$httpBackend_;
        $httpBackend.whenGET(/i18n.*/).respond(200, '');
    }));

    it('should exist', function () {
        expect(fService).toBeDefined();
    });

    describe('#validateApiKey', function() {

        it('proper data if valid 200 http-response', function(done) {
            var mockKey = '1234';
            $httpBackend.expectGET('http://data.fmi.fi/fmi-apikey/' + mockKey + '/wfs?request=getCapabilities').respond({payload: 'abc'});
            fService.validateApiKey(mockKey).then(function(result) {
                expect(result.data.data.payload).toBe('abc');
                done();
            });
            $httpBackend.flush();
        });

        it('err not null if error http-response', function(done) {
            var mockKey = '1234';
            $httpBackend.expectGET('http://data.fmi.fi/fmi-apikey/' + mockKey + '/wfs?request=getCapabilities').respond(404);
            fService.validateApiKey(mockKey).then(function(result) {
                expect(result.err).toBeTruthy();
                done();
            });
            $httpBackend.flush();
        });
    });

    describe('#regularHttpRequest', function() {

        it('proper data if valid 200 http-response', function(done) {
            var mockKey = '1234';
            $httpBackend.expectGET('http://data.fmi.fi/fmi-apikey/' + mockKey + '/wfs?request=getCapabilities').respond({payload: 'abc'});
            fService.regularHttpRequest(mockKey, {request: 'getCapabilities'}).then(function(result) {
                expect(result.data.data.payload).toBe('abc');
                done();
            });
            $httpBackend.flush();
        });

        it('err not null if error http-response', function(done) {
            var mockKey = '1234';
            $httpBackend.expectGET('http://data.fmi.fi/fmi-apikey/' + mockKey + '/wfs?request=getCapabilities').respond(404);
            fService.regularHttpRequest(mockKey, {request: 'getCapabilities'}).then(function(result) {
                expect(result.err).toBeTruthy();
                done();
            });
            $httpBackend.flush();
        });
    });

});
