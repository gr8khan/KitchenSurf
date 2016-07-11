'use strict';

angular.module('shopnxApp')
  .controller('FoodDetailsCtrl', function ($scope, $rootScope, Food, Category, socket, $stateParams, $location, $state, $injector) {
    var id = $stateParams.id;
    // var slug = $stateParams.slug;
    // Storing the food id into localStorage because the _id of the selected food which was passed as a hidden parameter from foods won't available on page refresh
    if (localStorage !== null && JSON !== null && id !== null) {
        localStorage.foodId = id;
    }
    var foodId = localStorage !== null ? localStorage.foodId : null;

    $scope.food = Food.get({id:foodId},function(data) {
      socket.syncUpdates('food', $scope.data);
      generateBreadCrumb('Category',data.category._id);
    });
    $scope.categories = Category.all.query();
    // To shuffle throught different food variants
    $scope.i=0;
    $scope.changeIndex =function(i){
        $scope.i=i;
    };

    // The main function to navigate to a page with some hidden parameters
    $scope.navigate = function(page,params){
      if(params){
        $location.replace().path(page+'/'+params.slug+'/'+params._id);
      }else{
        $location.replace().path('/');
      }
    };

    // Function to generate breadcrumb for category and foodType
    // Future: Put it inside a directive
    var generateBreadCrumb = function(page, id){
      $scope.breadcrumb = {};
      $scope.breadcrumb.items = [];
      var api = $injector.get(page);
      api.get({id:id}).$promise.then(function(child){
        $scope.breadcrumb.items.push(child);
        // var p = child.parent;
        // if(p != null){findFoodTypePath(1);}
        if(page==='Category'){
          $scope.breadcrumb.items.push({name:'All Categories'});
        }
        else if(page==='FoodType'){
          $scope.breadcrumb.items.push({name:'All FoodTypes'});
        }
      });
    };

  })

  .controller('MainCtrl', function ($scope, $state, $stateParams, $location, Food, FoodType, Category, Feature, socket, $rootScope, $injector, $loading) {

    if ($stateParams.foodSku) { // != null
        $scope.food = $scope.store.getFood($stateParams.foodSku);
    }




// For Price slider
    $scope.currencyFormatting = function(value){
      return  '$ ' + value.toString();
    };

    $scope.removeFoodType = function(foodType){
      var index = $scope.fl.foodTypes.indexOf(foodType);
      if (index > -1) {
          $scope.fl.foodTypes.splice(index, 1);
          $scope.filter();
      }
    }

    $scope.removeFeatures = function(feature){
      console.log($scope.fl.features,feature);
      // var index = $scope.fl.features.indexOf(feature);
      // if (index > -1) {
      //     $scope.fl.features.splice(index, 1);
      //     $scope.filter();
      // }
    }

    $scope.removeCategory = function(){
      $scope.fl.categories = undefined;
      $scope.filter();
    }

    $scope.foods = {};
    $scope.filtered = {};
    $scope.foods.busy = false;
    $scope.foods.end = false;
    $scope.foods.after = 0;
    $scope.foods.items = [];
    // $scope.foods.sort = sortOptions[0].val;
    $scope.fl = {};
    $scope.fl.foodTypes = [];
    $scope.fl.categories = [];
    $scope.priceSlider = {};
    $scope.features = Feature.group.query();
    $scope.navigate = function(page,params){
      // var params = params.delete('$$hashKey');
      if(page==='sort'){
        delete params.$$hashKey;
        var paramString = JSON.stringify(params);
        // console.log(paramString);
        $state.go($state.current, {sort: paramString}, {reload: true});
      }
      else if(params){
        $location.replace().path(page+'/'+params.slug+'/'+params._id);
      }else{
        $location.replace().path('/');
      }
    };
    var generateBreadCrumb = function(page, id){
      $scope.breadcrumb.items = [];
      var api = $injector.get(page);
      api.get({id:id}).$promise.then(function(child){
        $scope.breadcrumb.items.push(child);
        // var p = child.parent;
        // if(p != null){findFoodTypePath(1);}
        if(page==='Category'){
          $scope.breadcrumb.items.push({name:'All Categories'});
        }else if(page==='FoodType'){
          $scope.breadcrumb.items.push({name:'All FoodTypes'});
        }
      });
    };


    var sort = $scope.foods.sort = $stateParams.sort;
    var q = {where:{active:true},limit:10};


    // displayFoods(q);
    var a = {};
    $scope.filter = function(){
      var f = [];
      if ($scope.foods.busy){ return; }
      $scope.foods.busy = true;
      if($scope.fl.features){
        angular.forEach($scope.fl.features,function(val, key){
          if(val.length>0){
            f.push({'features.key' : key, 'features.val' : { $in: val}});
          }
        });
      }
      if($scope.fl.foodTypes){
        if($scope.fl.foodTypes.length>0){
          var foodTypeIds = [];
          angular.forEach($scope.fl.foodTypes,function(foodType){
            foodTypeIds.push(foodType._id);
          });
          f.push({'foodType._id' : { $in: foodTypeIds } });
        }
      }
      if($scope.fl.categories){
        if($scope.fl.categories.length>0){
          var categoryIds = [];
          angular.forEach($scope.fl.categories,function(category){
            categoryIds.push(category._id);
          });
          f.push({'category._id' : { $in: categoryIds } });
        }
      }
      // if($scope.priceSlider)
      f.push({'variants.price' : { $gt: $scope.priceSlider.min, $lt:$scope.priceSlider.max } });
      // console.log(f.length);
      if(f.length>0){
        q.where = { $and : f};
      }else{
        q.where = {};
      }
      // console.log(f,q);

      displayFoods(q,true);
    };

    // $scope.filterFeatures = function() {
    //   if ($scope.foods.busy){ return; }
    //   $scope.foods.busy = true;
    //   a.fl = [];
    //   if($scope.fl.features){
    //       angular.forEach($scope.fl.features,function(val, key){
    //         if(val.length>0){
    //           a.fl.push({'features.key' : key, 'features.val' : { $in: val}});
    //         }
    //       });
    //       if(a.fl.length>0 && a.br && a.price) {
    //         q.where = { $and : [a.price, a.br,{$and : a.fl}]};
    //       }
    //       else if(a.br && a.price) {
    //         q.where = { $and : [a.price, a.br]};
    //       }else if(a.br) {
    //         q.where = { $and : [a.br]};
    //       }else{
    //         q.where = {};
    //       }
    //       displayFoods(q,true);
    //   }
    // };
    //
    // $scope.filterFoodTypes = function() {
    //   // This function required to query from database in place of filtering items from angular $scope,
    //   // In some cases we load only 20 foods for pagination in that case we won't be able to filter properly
    //   if ($scope.foods.busy){ return; }
    //   $scope.foods.busy = true;
    //   a.br = [];
    //   console.log($scope.priceSlider);
    //   if($scope.fl.foodTypes){
    //     if($scope.fl.foodTypes.length>0){
    //       var foodTypeIds = [];
    //       angular.forEach($scope.fl.foodTypes,function(foodType){
    //         foodTypeIds.push(foodType._id);
    //       });
    //       a.price = {'variants.price' : { $gt: $scope.priceSlider.min, $lt:$scope.priceSlider.max } };
    //         a.br = {'foodType._id' : { $in: foodTypeIds } };
    //         q.where = { $and : [a.price, a.br, {$and : a.fl}]};
    //     }else if(a.fl){
    //       q.where = { $and : [a.price, a.fl] };
    //     }else{
    //       q.where = { $and : [a.price] };
    //     }
    //   }else {
    //     q.where.foodType = undefined;
    //     q.where['foodType._id'] = undefined;
    //   }
    //   displayFoods(q,true);
    // };
    //
    // $scope.filterPrice = function(price) {
    //   // This function required to query from database in place of filtering items from angular $scope,
    //   // In some cases we load only 20 foods for pagination in that case we won't be able to filter properly
    //   $scope.foods.busy = false;
    //   $scope.foods.end = false;
    //   $scope.foods.after = 0;
    //   $scope.foods.items = [];
    //
    //   if ($scope.foods.busy){ return;}
    //   $scope.foods.busy = true;
    //     console.log('price');
    //   if(price){
    //     a.price = {'variants.price' : { $gt: price.min, $lt:price.max } };
    //     q.where = { $and : [a.price, a.br, {$and : a.fl}]};
    //   }else{
    //     q.where = { $and : [a.br, {$and : a.fl}]};
    //   }
    //   // q.where['variants.price'] = { $gt: price.min, $lt:price.max };
    //   displayFoods(q,true);
    // };

    $scope.sortNow = function(sort){
        q.sort = sort;
        displayFoods(q,true);
    };

    var displayFoods = function(q,flush){
      if(flush){
        q.skip = 0;
        $scope.foods.items = [];
        $scope.foods.end = false;
        $scope.foods.after = 0;
      }
      $loading.start('foods');
      $scope.foods.busy = true;
      Food.query(q, function(data){
          for (var i = 0; i < data.length; i++) {
              $scope.foods.items.push(data[i]);
          }
          $scope.filtered.count = data.length + $scope.foods.after;
          if(data.length>=5) { $scope.foods.after = $scope.foods.after + data.length; } else { $scope.foods.end = true;}
          $scope.foods.busy = false;
          $loading.finish('foods');
      }, function(){ $scope.foods.busy = false; $loading.finish('foods');});

      Food.count.query(q, function(res){
        $scope.foods.count = res[0].count;
      });
    };

    $scope.resetPriceRange = function(){
      $scope.priceSlider = {
          min: 0,
          max: 10000,
          ceil: 10000,
          floor: 0
      };
      $scope.filter();
    };

    if('page' in $stateParams){
      var categoryId;
      if($stateParams.page && $stateParams._id){
        $scope.foods.foodType = {_id : $stateParams._id};
        $scope.breadcrumb = {type: $stateParams.page};
        generateBreadCrumb($stateParams.page,$stateParams._id);
        if($stateParams.page==='Category'){
          // categoryId = $stateParams._id;
          $scope.fl.categories.push({_id:$stateParams._id,name:$stateParams.slug});
        }else if($stateParams.page==='FoodType'){
          $scope.fl.foodTypes.push({_id:$stateParams._id,name:$stateParams.slug});
        }
        $scope.resetPriceRange();
        // q.where['foodType._id'] = foodTypeId;
        // q.where['category._id'] = categoryId;
      }else{
        q = {sort:sort,limit:10};
      }
      $scope.filter();
    }else{
      q = {limit:10};
        // console.log('wppp',q);
    }

    $scope.scroll = function() {
        if ($scope.foods.busy || $scope.foods.end){ return;}
        $scope.foods.busy = false;
        q.skip = $scope.foods.after;
        displayFoods(q);
    };


    $scope.resetPriceRange();

});
