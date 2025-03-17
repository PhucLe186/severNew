const { db } = require('../../firebaseconfig/firebase');
class MenuController {
  index(req, res) {
    console.log('Session hiện tại:', req.session);
    if (!req.session.user) {
      return res
        .status(401)
        .json({ success: false, message: 'Chưa đăng nhập' });
    }

    res.json({ success: true, userId: req.session.user.uid });
  }
}

module.exports = new MenuController();
