const Menu = require('./menu');
const Auth = require('./auth');
const Cart= require('./cart');

function route(app) {
  app.use('/menu', Menu);
  app.use('/auth', Auth);
  app.use('/cart', Cart);


}

module.exports = route;
