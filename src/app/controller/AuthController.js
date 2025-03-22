const { db } = require('../../firebaseconfig/firebase');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hoangphuckaito1806@gmail.com',
    pass: 'cpeu neig yzvy bdbc',
  },
});

class AuthController {

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: 'Vui lòng nhập đầy đủ email và mật khẩu' });
      }

      const KhachHang = db.ref('khachhang');
      const snapshot = await KhachHang.orderByChild('email')
        .equalTo(email)
        .once('value');

      if (!snapshot.exists()) {
        res.status(400).json({ message: 'Email không tồn tại' });
        return;
      }

      const userData = Object.values(snapshot.val())[0];
      // const userId = Object.keys(snapshot.val())[0];
      if (!userData.isVerified) {
        res
          .status(400)
          .json({ message: 'tài khoản không tồn tại hoặc chưa xác thực' });
        return;
      }

      if (!(await bcrypt.compare(password, userData.secretPass))) {
        res.status(400).json({ message: 'Sai mật khẩu' });
        return;
      }

      req.session.user = { email: userData.email, uid: userData.userId };
      console.log(req.session.user)

      return res
        .status(200)
        .json({ message: 'Đăng nhập thành công', user: req.session.user });
    } catch (error) {
      console.error('Lỗi server:', error);
      return res.status(500).json({ message: 'Lỗi server' });
    }
  }

  checklogin(req, res) {
    if (req.session.user) {
      res.json({ login: true, user: req.session.user });
    } else {
      res.json({ loggin: false });
    }
  }

  logout(req, res) {
    try {
      // Xóa session
      req.session.destroy((err) => {
        if (err) {
          console.error('Lỗi khi đăng xuất:', err);
          return res.status(500).json({ message: 'Lỗi server' });
        }
        // Xóa cookie (nếu có)
        res.clearCookie('sessionId'); // Thay 'sessionId' bằng tên cookie session của bạn
        return res.status(200).json({ message: 'Đăng xuất thành công' });
      });
    } catch (error) {
      console.error('Lỗi server:', error);
      return res.status(500).json({ message: 'Lỗi server' });
    }
  }

  async register(req, res) {
    const { address, name, email, password, phone } = req.body;

    if (!address || !name || !email || !password || !phone) {
      res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
      return;
    }

    if (!/^([A-ZÀ-Ỹ][a-zà-ỹ]+)(\s[A-ZÀ-Ỹ][a-zà-ỹ]+)+$/.test(name)) {
      res.status(400).json({
        message:
          'Tên không hợp lệ! Vui lòng nhập họ và tên, viết hoa chữ cái đầu.',
      });
      return;
    }

    if (!/^(09|08|03)\d{8}$/.test(phone)) {
      res.status(400).json({ message: 'số điện thoại không đúng định dạng' });
      return;
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password)) {
      res
        .status(400)
        .json({ message: 'mật khẩu phải có cả chữ, số và ký tự đặt biệt ' });
      return;
    }

    try {
      const user = db.ref('khachhang');
      const snapshot = await user
        .orderByChild('email')
        .equalTo(email)
        .once('value');
      if (snapshot.val()) {
        res.status(400).json({ message: 'email đã tồn tại' });
        return;
      }
      const secretPass = await bcrypt.hash(password, 10);
      const userId = uuidv4();
      await user.child(userId).set({
        userId,
        name,
        phone,
        email,
        secretPass,
        address,
        isVerified: false,
      });
      const otp = Math.floor(100000 + Math.random() * 900000);
      const otpref = db.ref('otp').child(email.replace(/\./g, '_'));
      await otpref.set({ otp, expires: Date.now() + 300000 });
      await transporter.sendMail({
        from: 'hoangphuckaito1806@gmail.com',
        to: email,
        subject: 'xác thực tài khoản',
        text: `Mã otp của bạn là ${otp}`,
      });
      return res.status(201).json({
        success: true,
        message: 'đăng ký thành công, nhập otp để xác thực',
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Lỗi khi đăng ký!', error: error.message });
    }
  }

  async verify(req, res) {
    try {
      const { email, otp } = req.body;

      const Otp = db.ref('otp').child(email.replace('.', '_'));
      const snapshot = await Otp.once('value');
      const data = snapshot.val();

      if (!data) {
        res.status(400).json({ error: 'OTP không hợp lệ hoặc đã hết hạn!' });
        return;
      } else if (data.otp != otp) {
        res.status(400).json({ error: 'Mã OTP không đúng!' });
        return;
      }

      const userdata = db.ref('khachhang');
      const usersnapshot = await userdata.once('value');
      const list = usersnapshot.val();

      let userId = null;
      for (const id in list) {
        if (list[id].email === email) {
          userId = id;
          break;
        }
      }
      const user = db.ref('khachhang').child(userId);
      await user.update({ isVerified: true });

      await Otp.remove();

      res.json({ message: 'Xác thực thành công! Tài khoản đã kích hoạt.' });
    } catch (error) {
      res.status(500).json({ message: 'lỗi xác thực!', error: error.message });
      return;
    }
  }

  async forgot(req, res) {
    try {
      const { email } = req.body;

      const data = db.ref('khachhang');
      const snapshot = await data
        .orderByChild('email')
        .equalTo(email)
        .once('value');
      if (!snapshot.val()) {
        res
          .status(400)
          .json({ message: 'email không tồn tại, đăng ký ngay nhé' });
        return;
      }
      const otp = Math.floor(100000 + Math.random() * 900000);
      const otpref = db.ref('otp').child(email.replace(/\./g, '_'));
      await otpref.set({ otp, expires: Date.now() + 300000 });
      await transporter.sendMail({
        from: 'hoangphuckaito1806@gmail.com',
        to: email,
        subject: 'xác thực tài khoản',
        text: `Mã otp của bạn là ${otp}`,
      });
      return res.status(201).json({
        success: true,
        message: 'đăng ký thành công, nhập otp để xác thực',
      });
    } catch (error) {
      res.status(500).json({ message: 'lỗi xác thực!', error: error.message });
    }
  }
  async verifyy(req, res) {
    try {
      const { email, otp, password } = req.body;

      const Otp = db.ref('otp').child(email.replace('.', '_'));
      const snapshot = await Otp.once('value');
      const data = snapshot.val();

      if (!data) {
        res.status(400).json({ error: 'OTP không hợp lệ hoặc đã hết hạn!' });
        return;
      } else if (data.otp != otp) {
        res.status(400).json({ error: 'Mã OTP không đúng!' });
        return;
      }

      const userdata = db.ref('khachhang');
      const snapshotdata = await userdata.once('value');
      const list = snapshotdata.val();
      const secretPass = await bcrypt.hash(password, 10);

      let userID = null;
      for (const id in list)
        if (list[id].email === email) {
          userID = id;
        }
      const user = db.ref('khachhang').child(userID);
      await user.update({ secretPass });
      await Otp.remove();

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'lỗi xác thực!', error: error.message });
      return;
    }
  }
}

module.exports = new AuthController();
