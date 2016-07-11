'use strict';

var _ = require('lodash');
var Food = require('./food.model');

function isJson(str) {
  try {
      str = JSON.parse(str);
  } catch (e) {
      str = str;
  }
  return str
}

// Get all features group
exports.count = function(req, res) {
  if(req.query){
    var q = isJson(req.query.where);
    Food.find(q).count().exec(function (err, count) {
      if(err) { return handleError(res, err); }
      return res.status(200).json([{count:count}]);
    });
  }
};

// Get list of foods
exports.index = function(req, res) {
  if(req.query){
    // console.log(req.query,req.query.skip,req.query.limit,req.query.sort);
    var q = isJson(req.query.where);
    // console.log(q);
    var sort = isJson(req.query.sort);
    var select = isJson(req.query.select);
    // setTimeout(function(){
      Food.find(q).limit(req.query.limit).skip(req.query.skip).sort(sort).select(select).exec(function (err, foods) {
        if(err) { return handleError(res, err); }
        return res.status(200).json(foods);
      });
    // },2000);
  }else{
    Food.find(function (err, foods) {
      if(err) { return handleError(res, err); }
      return res.status(200).json(foods);
    });
  }
};

// Get a single food
exports.show = function(req, res) {
  Food.findById(req.params.id, function (err, food) {
    if(err) { return handleError(res, err); }
    if(!food) { return res.status(404).send('Not Found'); }
    return res.json(food);
  });
};

// Creates a new food in the DB.
exports.create = function(req, res) {
  req.body.uid = req.user.email; // id change on every login hence email is used
  req.body.updated = Date.now();
  if(req.body.name)
    req.body.nameLower = req.body.name.toString().toLowerCase();
  if(!req.body.slug && req.body.name)
    req.body.slug = req.body.name.toString().toLowerCase()
                      .replace(/\s+/g, '-')        // Replace spaces with -
                      .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
                      .replace(/\-\-+/g, '-')      // Replace multiple - with single -
                      .replace(/^-+/, '')          // Trim - from start of text
                      .replace(/-+$/, '');
  Food.create(req.body, function(err, food) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(food);
  });
};

// Updates an existing food in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  req.body.uid = req.user.email; // id change on every login hence email is used
  req.body.updated = Date.now();
  if(req.body.name)
    req.body.nameLower = req.body.name.toString().toLowerCase();
  if(!req.body.slug && req.body.name)
    req.body.slug = req.body.name.toString().toLowerCase()
                      .replace(/\s+/g, '-')        // Replace spaces with -
                      .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
                      .replace(/\-\-+/g, '-')      // Replace multiple - with single -
                      .replace(/^-+/, '')          // Trim - from start of text
                      .replace(/-+$/, '');
  // var obj = JSON.parse(req.body.variants);
  // console.log('EDit', obj);
  Food.findById(req.params.id, function (err, food) {
    if (err) { return handleError(res, err); }
    if(!food) { return res.status(404).send('Not Found'); }
    food.variants = req.body.variants;
    food.features = req.body.features;
    food.keyFeatures = req.body.keyFeatures;
    var updated = _.merge(food, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(food);
    });
  });
};

// Deletes a food from the DB.
exports.destroy = function(req, res) {
  Food.findById(req.params.id, function (err, food) {
    if(err) { return handleError(res, err); }
    if(!food) { return res.status(404).send('Not Found'); }
    food.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
