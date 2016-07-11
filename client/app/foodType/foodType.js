'use strict';

angular.module('shopnxApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('foodType', {
        title: 'Add, Remove, Edit FoodTypes',
        url: '/foodType',
        templateUrl: 'app/foodType/foodType.html',
        controller: 'FoodTypeCtrl',
        authenticate: true
      });
  });
