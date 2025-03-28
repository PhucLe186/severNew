const express = require('express');
const route = express.Router();

const cartController = require('../app/controller/cartController');

route.use('/update', cartController.updateQuantity);
route.use('/delete', cartController.deploy);
route.use('/', cartController.index);

module.exports = route;
