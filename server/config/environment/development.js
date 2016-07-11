'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://ds019882.mlab.com:19882/tastebudz',
  //  uri: 'localhost:27017/kitchensurf',
    options: {
      user: 'tastebudzer',
      pass: 'purdue123'
    },
  },

  seedDB: true
};
