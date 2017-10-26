const fs = require('fs');
const dotenv = require('dotenv');


if (process.env.NODE_ENV === 'dev') {
  process.env = dotenv.parse(fs.readFileSync('.env.dev'));
}

module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  ICOBOT_TOKEN: process.env.ICOBOT_TOKEN,
  PORT: process.env.PORT,
  FIREBASE_URL: process.env.FIREBASE_URL,
  PRIVATE_KEY: process.env.PRIVATE_KEY,
};
