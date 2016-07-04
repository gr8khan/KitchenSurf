'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CountrySchema = new Schema({
  name: String,
  dial_code: String,
  code: String,
  active:false
});

module.exports = mongoose.model('Country', CountrySchema);
