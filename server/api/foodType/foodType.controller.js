'use strict';

var _ = require('lodash');
var FoodType = require('./foodType.model.js');

// Get list of foodTypes
exports.index = function(req, res) {
  var q = req.query;
  // setTimeout(function(){
    FoodType.find(q, function (err, foodTypes) {
      if(err) { return handleError(res, err); }
      return res.status(200).json(foodTypes);
    });
  // },1000);
};

// Get a single foodType
exports.show = function(req, res) {
  FoodType.findById(req.params.id, function (err, foodType) {
    if(err) { return handleError(res, err); }
    if(!foodType) { return res.status(404).send('Not Found'); }
    return res.json(foodType);
  });
};

// Creates a new foodType in the DB.
exports.create = function(req, res) {
  req.body.uid = req.user.email; // id change on every login hence email is used
  req.body.updated = Date.now();
  if(!req.body.slug && req.body.info)
  req.body.slug = req.body.info.toString().toLowerCase()
                      .replace(/\s+/g, '-')        // Replace spaces with -
                      .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
                      .replace(/\-\-+/g, '-')      // Replace multiple - with single -
                      .replace(/^-+/, '')          // Trim - from start of text
                      .replace(/-+$/, '');

  FoodType.create(req.body, function(err, foodType) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(foodType);
  });
};

// Updates an existing foodType in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  req.body.uid = req.user.email; // id change on every login hence email is used
  req.body.updated = Date.now();
  if(!req.body.slug && req.body.info)
  req.body.slug = req.body.info.toString().toLowerCase()
                      .replace(/\s+/g, '-')        // Replace spaces with -
                      .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
                      .replace(/\-\-+/g, '-')      // Replace multiple - with single -
                      .replace(/^-+/, '')          // Trim - from start of text
                      .replace(/-+$/, '');

  FoodType.findById(req.params.id, function (err, foodType) {
    if (err) { return handleError(res, err); }
    if(!foodType) { return res.status(404).send('Not Found'); }
    var updated = _.merge(foodType, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(foodType);
    });
  });
};

// Deletes a foodType from the DB.
exports.destroy = function(req, res) {
  FoodType.findById(req.params.id, function (err, foodType) {
    if(err) { return handleError(res, err); }
    if(!foodType) { return res.status(404).send('Not Found'); }
    foodType.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
