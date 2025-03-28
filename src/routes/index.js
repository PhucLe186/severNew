const Menu = require('./menu');
const Auth = require('./auth');
const Cart= require('./cart');
const Book= require('./book')
const Voucher= require('./voucher')
const Detail= require('./Detail')
const table = require('./table')
function route(app) {
  app.use('/menu', Menu);
  app.use('/auth', Auth);
  app.use('/cart', Cart);
  app.use('/book', Book);
  app.use('/voucher', Voucher);
  app.use('/detail', Detail);
  app.use('/tables', table);


}

module.exports = route;
