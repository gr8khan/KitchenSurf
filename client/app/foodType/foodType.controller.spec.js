'use strict';

describe('Controller: FoodTypeCtrl', function () {

  // load the controller's module
  beforeEach(module('shopnxApp'));

  var FoodTypeCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FoodTypeCtrl = $controller('FoodTypeCtrl', {
      $scope: scope
    });
  }));
  // 
  // it('should ...', function () {
  //   expect(true).toBe(true);
  // });
});
