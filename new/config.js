const fs = require('fs');
const dotenv = require('dotenv');


if (process.env.NODE_ENV === 'production') {
  dotenv.config();
} else if (process.env.NODE_ENV === 'dev') {
  process.env = dotenv.parse(fs.readFileSync('.env.dev'));
}

module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  MONGODB_URL: process.env.MONGODB_URL,
  PORT: process.env.PORT,
  ICOBOT_TOKEN: process.env.ICOBOT_TOKEN,
  REDIS_URL: process.env.REDIS_URL,
};