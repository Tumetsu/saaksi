'use strict';

describe('DailyWeatherCtrl', function () {

    // load the controller's module
    beforeEach(module('saaksiApp'));
    beforeEach(module('saaksiApp.dailyWeather'));
    beforeEach(module('templates'));

    beforeEach(module(function ($stateProvider) {
        $stateProvider.state('A', { url: '/asd' });
    }));

    var DailyWeatherCtrl,
        $httpBackend,
        $q,
        scope,
        mockFmiService;

    var sampleStationData = {
        "fmisid": "101533",
        "wmo": "2787",
        "name_en": "Alajärvi Möksy",
        "name_fi": "Alajärvi Möksy",
        "datasets": {
            "ds1": {
                "interval": 1,
                "begin": "1996-06-27T00:00:00Z",
                "name": "Säähavaintojen vuorokausiarvot: Alajärvi Möksy",
                "end": null
            },
            "ds2": {
                "interval": 10,
                "begin": "2010-01-01T00:00:00Z",
                "name": "Säähavainnot: Alajärvi Möksy",
                "end": null
            }
        },
        "lon": "24.26",
        "lat": "63.09"
    };

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, _$q_, _$httpBackend_) {
        scope = $rootScope.$new();
        $q = _$q_;
        $httpBackend = _$httpBackend_;

        //mocks
        mockFmiService = {
            getStationMetadata: function () {}
        };

        //mock implementation to return station metadata
        spyOn(mockFmiService, 'getStationMetadata').and.callFake(function() {
            var def = $q.defer();
            def.resolve({
                data:[sampleStationData]
            });
            return def.promise;
        });

        DailyWeatherCtrl = $controller('DailyWeatherCtrl', {
            $scope: scope,
            // place here mocked dependencies
            fmiService: mockFmiService
        });

        $httpBackend.whenGET(/i18n.*/).respond(200, '');
    }));


    it('expect to retrieve the station metadata', function (done) {
        scope.$digest();
        expect(mockFmiService.getStationMetadata.calls.count()).toBe(1);
        expect(scope.stations[0].fmisid).toEqual(sampleStationData.fmisid);
        done();
    });

    describe('#resetSelections', function() {
        it('expect function to reset selectedDataset and dateRange to initial values', function() {
            //setup test data
            scope.selectedDataset = sampleStationData.datasets.ds2;
            scope.dateRange.begin = '02.11.2015';
            scope.dateRange.end = '04.11.2015';
            //reset test data
            scope.resetSelections();
            expect(scope.selectedDataset.name).toBeUndefined();
            expect(scope.dateRange.begin).toBeNull();
            expect(scope.dateRange.end).toBeNull();
            expect(scope.dateRange.error.begin).toBeNull();
            expect(scope.dateRange.error.end).toBeNull();
        });
    });

    describe('#setProcessStage', function() {
        it('expect to set processStage to 0 when selectedStation is not set', function() {
            scope.resetSelections();
            scope.setProcessStage();
            expect(scope.processStage).toEqual(0);
        });

        it('expect to set processStage to 1 when selectedDataset is not set', function() {
            scope.resetSelections();
            scope.selectedStation = sampleStationData;
            scope.setProcessStage();
            expect(scope.processStage).toEqual(1);
        });

        it('expect to set processStage to 2 when range has error', function() {
            scope.resetSelections();
            scope.selectedStation = sampleStationData;
            scope.selectedDataset = sampleStationData.datasets.ds2;
            scope.dateRange.error.begin = 'Error';
            scope.setProcessStage();
            expect(scope.processStage).toEqual(2);
        });

        it('expect to set processStage to 3 when everything is ok', function() {
            scope.resetSelections();
            scope.selectedStation = sampleStationData;
            scope.selectedDataset = sampleStationData.datasets.ds2;
            scope.setProcessStage();
            expect(scope.processStage).toEqual(3);
        });
    });

    describe('#setDateLimits', function() {
        it('expect function to change selectedDateset\'s end to current date', function() {
            //setup test data
            scope.selectedDataset = sampleStationData.datasets.ds2;
            scope.setDateLimits();
            expect(scope.selectedDataset.end.setHours(0,0,0,0)).toEqual(new Date().setHours(0,0,0,0));

        });

        it('expect function to not change selectedDateset\'s end if it is already set', function() {
            //setup test data
            scope.selectedDataset = sampleStationData.datasets.ds2;
            scope.selectedDataset.end = new Date(1234);
            scope.setDateLimits();
            expect(scope.selectedDataset.end.setHours(0,0,0,0)).not.toEqual(new Date().setHours(0,0,0,0));
        });
    });

    describe('#validateDates', function() {
        it('expect error in daterange when begin is smaller than dataset\'s start', function() {
            scope.selectedDataset = sampleStationData.datasets.ds2;
            scope.setDateLimits();
            var testRange = {
                begin: '01.01.2009',
                end: '01.01.2011',
                error: {
                    begin: null,
                    end: null
                }
            };
            var result = scope.validateDates(testRange);
            expect(result.error.begin).toEqual('DAILY.ERRORS.BEGIN_DATE_BIGGER_EARLIEST');
        });

        it('expect error in daterange when end is bigger than dataset\'s end', function() {
            scope.selectedDataset = sampleStationData.datasets.ds2;
            scope.selectedDataset.end = new Date('2015-11-20T11:54:21.374Z');
            scope.setDateLimits();
            var testRange = {
                begin: '01.02.2011',
                end: '01.01.2025',
                error: {
                    begin: null,
                    end: null
                }
            };
            var result = scope.validateDates(testRange);
            expect(result.error.end).toEqual('DAILY.ERRORS.END_DATE_SMALLER_LAST');
        });

        it('expect error in daterange when end is smaller than begin', function() {
            scope.selectedDataset = sampleStationData.datasets.ds2;
            scope.selectedDataset.end = new Date('2015-11-20T11:54:21.374Z');
            scope.setDateLimits();
            var testRange = {
                begin: '01.02.2012',
                end: '01.01.2011',
                error: {
                    begin: null,
                    end: null
                }
            };
            var result = scope.validateDates(testRange);
            expect(result.error.begin).toEqual('DAILY.ERRORS.BEGIN_DATE_SMALLER_END');
        });

        it('expect error when begin dates are in invalid format', function() {
            scope.selectedDataset = sampleStationData.datasets.ds2;
            scope.setDateLimits();
            var testRange = {
                begin: '01.02.201rter2',
                end: '01.01.2011',
                error: {
                    begin: null,
                    end: null
                }
            };
            var result = scope.validateDates(testRange);
            expect(result.error.begin).toEqual('DAILY.ERRORS.BEGIN_DATE_INVALID');
        });

        it('expect error when end dates are in invalid format', function() {
            scope.selectedDataset = sampleStationData.datasets.ds2;
            scope.setDateLimits();
            var testRange = {
                begin: '01.02.2012',
                end: '01.01.2hdgf011',
                error: {
                    begin: null,
                    end: null
                }
            };
            var result = scope.validateDates(testRange);
            expect(result.error.end).toEqual('DAILY.ERRORS.END_DATE_INVALID');
        });

    });

    describe('#selectedStation watch', function() {

        it('expect updated map after station selection', function() {
            scope.selectedStation = {
                originalObject: sampleStationData
            };
            scope.$digest();
            expect(scope.map.center.latitude).toEqual(parseFloat(sampleStationData.lat));
            expect(scope.map.center.longitude).toEqual(parseFloat(sampleStationData.lon));
        });
    });

});
