const fs = require('fs');
const dotenv = require('dotenv');


if (process.env.NODE_ENV === 'production') {
  dotenv.config();
} else if (process.env.NODE_ENV === 'dev') {
  process.env = dotenv.parse(fs.readFileSync('.env.dev'));
}

module.exports = {
  NODE_ENV: 'dev',
  ICOBOT_TOKEN: process.env.ICOBOT_TOKEN,
  PORT: process.env.PORT,
  FIREBASE_URL: process.env.FIREBASE_URL,
};
