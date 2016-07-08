'use strict';

var express = require('express');
var controller = require('./coupon.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('cook'), controller.index);
router.get('/:id', controller.show);
router.post('/', auth.hasRole('cook'), controller.create);
router.put('/:id', auth.hasRole('cook'), controller.update);
router.patch('/:id', auth.hasRole('cook'), controller.update);
router.delete('/:id', auth.hasRole('cook'), controller.destroy);

module.exports = router;
