const express = require('express');
const route = express.Router();

const authController = require('../app/controller/bookController');

route.use('/table', authController.table);
route.use('/book', authController.book)


module.exports = route;
