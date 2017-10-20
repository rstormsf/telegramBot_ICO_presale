const fs = require('fs');
const { NODE_ENV, PORT, ICOBOT_TOKEN } = require('./config');
const bot = require('./src/bot');


if (NODE_ENV === 'production') {
  bot.startWebhook(`/${ICOBOT_TOKEN}`, null, PORT);
} else if (NODE_ENV === 'dev') {
  // const tlsOptions = {
  //   key: fs.readFileSync('key.key'),
  //   cert: fs.readFileSync('cert.pem'),
  // };
  bot.startWebhook(`/${ICOBOT_TOKEN}`, null, PORT);
}

console.log(`Server is listening to localhost:${PORT}`);