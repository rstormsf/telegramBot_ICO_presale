const config = require('../config');
const admin = require('firebase-admin')
 
const serviceAccount = require('../serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: config.FIREBASE_URL,
})

const database = admin.database()

module.exports = { database };
