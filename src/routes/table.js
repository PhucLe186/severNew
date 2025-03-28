const express = require('express');
const route = express.Router();

const tableController = require('../app/controller/TableController');



route.use('/add', tableController.addtable);
route.use('/search', tableController.search);
route.use('/:id', tableController.detail);
route.use('/:id/delete', tableController.delete);
route.use('/:id/status', tableController.updatestatus);
route.use('/', tableController.table);


module.exports = route;