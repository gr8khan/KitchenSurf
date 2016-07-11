'use strict';

angular.module('shopnxApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        title: 'eCommerce Fashion Store Using AngularJS - ShopNx',
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        params: {
          sort: null
        }
      })
      .state('foodDetail', {
        title: 'Details of selected food',
        params: {
          id: null,
          slug: null
        },
        url: '/p/:slug',
        templateUrl: 'app/main/food-details.html',
        controller: 'FoodDetailsCtrl'
      })
      .state('SubFood', {
        title: 'All foods under current category or foodType',
        url: '/:page/:slug/:_id',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        params: {
          id: null,
          sort: null,
          foodType: null,
          category: null,
          price1: 0,
          price2: 100000
        }
      });
  });
