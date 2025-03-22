require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const { db } = require('../src/firebaseconfig/firebase');

const cors = require('cors');
const route = require('./routes');
const session = require('express-session');
const cookieParser = require('cookie-parser');


const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(morgan('combined'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true },
  }),
);
route(app);

app.post('/cart2', async (req, res) => {
  try {
      if (!req.session.user) {
          return res.status(401).json({ message: "Bạn chưa đăng nhập" });
      }

      const userId = req.session.user.uid;  // 🔥 Lấy ID user từ session
      const { ID_MonAn } = req.body;  // 🔥 Lấy ID món ăn từ request body

      if (!ID_MonAn) {
          return res.status(400).json({ message: "Thiếu ID món ăn" });
      }

      console.log("User ID:", userId);
      console.log("ID Món Ăn:", ID_MonAn);

      const cartRef = db.ref(`GioHang/${userId}/${ID_MonAn}`);
      const cartSnapshot = await cartRef.once("value");

      if (!cartSnapshot.exists()) {
          return res.status(404).json({ message: "Món ăn không tồn tại trong giỏ hàng" });
      }

      await cartRef.remove();
      console.log("✅ Xóa thành công!");

      const updatedCart = (await db.ref(`GioHang/${userId}`).once("value")).val();
      return res.json(updatedCart || {});
  } catch (error) {
      console.error("🔥 LỖI SERVER:", error);
      return res.status(500).json({ success: false, message: "Lỗi server", error: error.toString() });
  }
});

app.listen(port, () => {
  console.log(`chạy thành công server tại http:localhost:${port}`);
});
