'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FoodTypeSchema = new Schema({
  name: String,
  slug: String,
  info: String,
  parent: String,
  image: String,
  uid: String,
  foodType: Number,
  active: { type: Boolean, default: true },
  updated: {type: Date, default: Date.now}
});

module.exports = mongoose.model('FoodType', FoodTypeSchema);
