const express = require('express');
const route = express.Router();

const cartController = require('../app/controller/cartController');

route.use('/', cartController.index);
route.post('/delete', cartController.deploy);


module.exports = route;
