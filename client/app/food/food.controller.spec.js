'use strict';

describe('Controller: FoodCtrl', function () {

  // load the controller's module
  beforeEach(module('shopnxApp'));

  var FoodCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FoodCtrl = $controller('FoodCtrl', {
      $scope: scope
    });
  }));

});
