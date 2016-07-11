'use strict';

angular.module('shopnxApp')
  .controller('FoodCtrl', function ($scope, socket, Food, Category, FoodType, Feature, Modal, toastr, $loading, Settings) {
    var cols = [
      {heading:'sku',dataType:'text', sortType:'lowercase'},
      {heading:'name',dataType:'text', sortType:'lowercase'},
      {heading:'info',dataType:'text', sortType:'lowercase'}
    ];
    // var cols = ['sku','name','nameLower','slug','status','info','uid', 'active','img'];
    $scope.foods = [];
    $scope.food = {};
    $scope.variant = {};
    $scope.newFeature = {};
    $scope.newKF = {};
    $scope.food.variants = [];
    $scope.food.features = [];
    $scope.food.keyFeatures = [];
    // $scope.selected = {};
    // $scope.selected.feature = [];
    $scope.features = Feature.query();
    // $scope.items=$scope.features.map(function(name){ return { key:key,val:val}; })
    // $scope.selected.feature[0] = {"key":"Fit","val":"Tight"};
    $loading.start('foods');
    $scope.foods = Food.query({}, function() {
      $loading.finish('foods');
      socket.syncUpdates('food', $scope.foods);
    });

    $scope.categories = Category.query(function() {
      socket.syncUpdates('category', $scope.categories);
    });
    $scope.foodTypes = FoodType.query(function() {
      socket.syncUpdates('foodType', $scope.foodTypes);
    });
    $scope.edit = function(food) {
      var title; if(food.name){ title = 'Editing ' + food.name;} else{ title = 'Add New';}
      Modal.show(food,{title:title, api:'Food', columns: cols});
    };
    $scope.delete = function(food) {
      if(Settings.demo){
        toastr.error('Delete not allowed in demo mode');
        return;
      }
      if(confirm('Are you sure to delete the food?')){
        Food.delete({id:food._id});
      }
    };
    $scope.save = function(food){
      if(Settings.demo){
        toastr.error('Save not allowed in demo mode');
        return;
      }
      if('variants' in $scope.food){
      }else{
          $scope.food.variants = [];
      }
      if('keyFeatures' in $scope.food){
      }else{
          $scope.food.keyFeatures = [];
      }
      if('features' in $scope.food){
      }else{
          $scope.food.features = [];
      }

      if('size' in $scope.variant){
        $scope.food.variants.push($scope.variant);
        // console.log($scope.food.variants);
      }
      // console.log($scope.newKF);
      if('val' in $scope.newKF){
        $scope.food.keyFeatures.push($scope.newKF.val);
        console.log($scope.food.keyFeatures);
      }
      if('key' in $scope.newFeature){
        $scope.food.features.push($scope.newFeature);
        // console.log($scope.food.features);
      }
      $scope.variant = {};
      $scope.newKF = {};
      $scope.newFeature = {};

      // $scope.feature.key = feature.key.name;
      // $scope.food.feature = $scope.selected.feature;

      // console.log($scope.selected.feature);
      if('_id' in food){
          Food.update({ id:$scope.food._id }, $scope.food).$promise.then(function() {
            toastr.success("Food info saved successfully","Success");
          }, function(error) { // error handler
            var err = error.data.errors;
            toastr.error(err[Object.keys(err)].message,err[Object.keys(err)].name);
          });
        }
        else{
          Food.save($scope.food).$promise.then(function() {
            toastr.success("Food info saved successfully","Success");
          }, function(error) { // error handler
              var err = error.data.errors;
              toastr.error(err[Object.keys(err)].message,err[Object.keys(err)].name);
          });
        }
    };
    $scope.changeActive = function(b){ // success handler
      b.active = !b.active;
      Food.update({ id:b._id }, b).$promise.then(function() {

      }, function(error) { // error handler
          // console.log(error);
          toastr.error(error.statusText + ' (' +  error.status + ')');
          b.active = !b.active;
      });
    };

    $scope.deleteFeature = function(index,food) {
      $scope.food.features.splice(index, 1);
      $scope.save(food)
    };

    $scope.deleteKF = function(index,food) {
      $scope.food.keyFeatures.splice(index, 1);
      $scope.save(food)
    };

    $scope.deleteVariants = function(index,food) {
      $scope.food.variants.splice(index, 1);
      $scope.save(food)
    };

    $scope.foodDetail = function(food){
        if(food){ $scope.food = food; }
        else{ $scope.food = {}; }
    };

  });
