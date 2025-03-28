require('dotenv').config();
const express = require('express');
const morgan = require('morgan');

const cors = require('cors');
const route = require('./routes');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { db } = require('./firebaseconfig/firebase');

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
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true },
  }),
);
route(app);



// app.get('/tables', async (req, res) => {
//   try {
//       const snapshot = await db.ref('ban').once('value');
//       const tables = snapshot.val() || {};
//       res.json(Object.entries(tables).map(([id, data]) => ({ id, ...data })));
//   } catch (error) {
//       res.status(500).send(error);
//   }
// });

// // Thêm một bàn mới
// app.post('/tables', async (req, res) => {
//   try {
//       const newTable = req.body;
//       const ref = db.ref('tables').push();
//       await ref.set(newTable);
//       res.json({ id: ref.key, ...newTable });
//   } catch (error) {
//       res.status(500).send(error);
//   }
// });

// // Chỉnh sửa thông tin bàn
// app.put('/tables/:id', async (req, res) => {
//   try {
//       const { id } = req.params;
//       const updatedTable = req.body;
//       await db.ref(`tables/${id}`).update(updatedTable);
//       res.json({ id, ...updatedTable });
//   } catch (error) {
//       res.status(500).send(error);
//   }
// });


// app.delete('/tables/:id', async (req, res) => {
//   try {
//       const { id } = req.params;
//       await db.ref(`tables/${id}`).remove();
//       res.status(204).send();
//   } catch (error) {
//       res.status(500).send(error);
//   }
// });

// // Cập nhật trạng thái bàn
// app.patch('/tables/:id/status', async (req, res) => {
//   try {
//       const { id } = req.params;
//       const { status } = req.body;
//       await db.ref(`tables/${id}`).update({ status });
//       res.json({ id, status });
//   } catch (error) {
//       res.status(500).send(error);
//   }
// });

// Tìm kiếm bàn
// app.get('/tables/search', async (req, res) => {
//   try {
//       const { number, TinhTrangBan } = req.query;
//       const snapshot = await db.ref('ban').once('value');
//       let tables = snapshot.val() || {};
      
//       tables = Object.entries(tables).map(([id, data]) => ({ id, ...data }));

//       if (number) {
//           tables = tables.filter(table => table.number == number);
//       }
//       if (TinhTrangBan) {
//           tables = tables.filter(table => table.TinhTrangBan == TinhTrangBan);
//       }

//       res.json(tables);
//   } catch (error) {
//       res.status(500).send(error);
//   }
// });


app.listen(port, () => {
  console.log(`chạy thành công server tại http:localhost:${port}`);
});
