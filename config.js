const fs = require('fs');
const dotenv = require('dotenv');


if (process.env.NODE_ENV === 'production') {
  dotenv.config();
} else if (process.env.NODE_ENV === 'dev') {
  process.env = dotenv.parse(fs.readFileSync('.env.dev'));
}

module.exports = {
  NODE_ENV: 'dev',
  ICOBOT_TOKEN: '462248772:AAFkBFQnVDDDcFtJz7Y6yWRO-eDhoG25OPg',
  PORT: 8443,
  FIREBASE_URL: 'https://presalebot-54914.firebaseio.com',
};
