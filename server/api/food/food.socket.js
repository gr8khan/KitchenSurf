/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Food = require('./food.model');

exports.register = function(socket) {
  Food.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Food.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('food:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('food:remove', doc);
}
