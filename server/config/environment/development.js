'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://ds019882.mlab.com:19882/tastebudz',
    options: {
      user: 'tastebudzer',
      pass: 'purdue123'
    },
  },

  seedDB: true
};
