const express = require('express');
const route = express.Router();

const authController = require('../app/controller/AuthController');

route.use('/login', authController.login);
route.use('/check', authController.checklogin);
route.use('/logout', authController.logout);
route.use('/register', authController.register);
route.use('/verify', authController.verify);
route.use('/verifyy', authController.verifyy);
route.use('/forgot', authController.forgot);

module.exports = route;
