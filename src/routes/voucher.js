const express = require('express');
const route = express.Router();

const menuController = require('../app/controller/voucherController');

route.use('/selectvoucher', menuController.selectVoucher);
route.use('/apply', menuController.apply);
route.use('/', menuController.voucher);

module.exports = route;
