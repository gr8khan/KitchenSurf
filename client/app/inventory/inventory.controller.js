'use strict';

angular.module('shopnxApp')
  .controller('InventoryCtrl', function ($scope, socket, Food, Modal, Settings) {
    $scope.foods = [];

    $scope.foods =
    Food.query(function() {
      socket.syncUpdates('food', $scope.foods);
    });

    $scope.addFood = function() {
      if(Settings.demo){
        toastr.error('Adding food won\'t happen in demo mode');
        return;
      }
      if($scope.food === ''){
        return;
      }
      Food.save($scope.food);
      $scope.food = {};
    };

    $scope.editFood = function(food) {
      Modal.show(food,{title:food.name});
    };

    $scope.deleteFood = Modal.delete(function(food) {
      if(Settings.demo){
        toastr.error('Delete food will not work in demo mode');
        return;
      }
      Food.delete({id:food._id});
    });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('food');
    });

  });
