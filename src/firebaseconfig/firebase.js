require('dotenv').config();
const admin = require('firebase-admin');


const serviceAccount = require('./serviceAccountKey.json');


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.URLDBRT,
});

const db = admin.database();

module.exports = { db };
