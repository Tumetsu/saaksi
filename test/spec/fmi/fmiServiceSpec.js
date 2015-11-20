'use strict';

describe('fmiService', function () {

    // load the module
    beforeEach(module('saaksiApp'));
    beforeEach(module('saaksiApp.fmi'));
    beforeEach(module('templates'));

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

    describe('#getStationMetadata', function() {

        it('proper data if given type is weather', function(done) {
            $httpBackend.expectGET('data/weather_stations_metadata.json').respond({err: null, data: [1, 2, 3]});
            fService.getStationMetadata('weather').then(function(result) {
                expect(result.data.data[0]).toBe(1);
                done();
            });
            $httpBackend.flush();
        });

        it('err not null if error http-response', function(done) {
            $httpBackend.expectGET('data/weather_stations_metadata.json').respond(404);
            fService.getStationMetadata('weather').then(function(result) {
                expect(result.err).toBeTruthy();
                done();
            });
            $httpBackend.flush();
        });

        it('err if given type is invalid', function(done) {
            fService.getStationMetadata('notCorrect').then(function() {
                done('Should have rejected.');
            }, function(result) {
                expect(result.err.message).toBe('Not a valid metadata type');
                done();
            });
            $httpBackend.flush();
        });
    });

});
