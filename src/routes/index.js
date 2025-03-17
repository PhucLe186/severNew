const Menu = require('./menu');
const Auth = require('./auth');
function route(app) {
  app.use('/menu', Menu);
  app.use('/auth', Auth);
}

module.exports = route;
