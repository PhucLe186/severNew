const express = require('express');
const route = express.Router();

const menuController = require('../app/controller/menuController');

route.use('/', menuController.index);

module.exports = route;
