const fs = require('fs');
const dotenv = require('dotenv');


if (process.env.NODE_ENV === 'production') {
  dotenv.config();
} else if (process.env.NODE_ENV === 'dev') {
  process.env = dotenv.parse(fs.readFileSync('.env.dev'));
}

module.exports = {
  // MONGODB_URL: process.env.MONGODB_URL,
  // PORT: process.env.PORT,
  // ICOBOT_TOKEN: process.env.ICOBOT_TOKEN,
  // REDIS_URL: process.env.REDIS_URL,
  NODE_ENV: 'dev',
  ICOBOT_TOKEN: '462248772:AAFkBFQnVDDDcFtJz7Y6yWRO-eDhoG25OPg',
  PORT: 8443,
  MONGODB_URL: 'mongodb://127.0.0.1:27017',
  REDIS_URL: 'redis://127.0.0.1:6379',
};
