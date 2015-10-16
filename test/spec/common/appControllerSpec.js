'use strict';

describe('AppCtrl', function () {

    // load the controller's module
    beforeEach(module('saaksiApp'));

    var AppCtrl,
        translate,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, _$translate_) {
        scope = $rootScope.$new();
        translate = _$translate_;

        AppCtrl = $controller('AppCtrl', {
            $scope: scope,
            $translate: translate
            // place here mocked dependencies
        });

    }));

    describe('#changeLanguage', function() {
        it('expect language to toggle between finnish and english', function (done) {
            var currentLang = translate.use();
            scope.changeLanguage();
            expect(translate.use()).not.toBe(currentLang);
            scope.changeLanguage();
            expect(translate.use()).toBe(currentLang);
            done();
        });


    });


});
