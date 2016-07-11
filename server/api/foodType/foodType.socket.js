/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var FoodType = require('./foodType.model.js');

exports.register = function(socket) {
  FoodType.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  FoodType.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('foodType:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('foodType:remove', doc);
}
