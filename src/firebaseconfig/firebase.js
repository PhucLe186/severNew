require('dotenv').config();
const admin = require('firebase-admin');

// Nhập tệp Service Account Key
const serviceAccount = require('./serviceAccountKey.json');

// Khởi tạo Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.URLDBRT, // Thay URL Firebase tại đây
});

const db = admin.database();

module.exports = { db };
