const express = require('express');
const route = express.Router();

const menuController = require('../app/controller/menuController');

route.use('/add', menuController.add);
route.use('/', menuController.index);

module.exports = route;
