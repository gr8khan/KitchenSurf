'use strict';

angular.module('shopnxApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('food', {
        title: 'Foods administration (Add, Remove, Edit)',
        url: '/food',
        templateUrl: 'app/food/food.html',
        controller: 'FoodCtrl',
        authenticate: true
      });
  });
