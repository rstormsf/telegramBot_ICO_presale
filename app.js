const fs = require('fs');
const { NODE_ENV, PORT, ICOBOT_TOKEN } = require('./config');
const bot = require('./src/bot');


if (NODE_ENV === 'production') {
  bot.startWebhook(`/${ICOBOT_TOKEN}`, null, PORT);
} else if (NODE_ENV === 'dev') {
  const tlsOptions = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt'),
  };
  console.log(ICOBOT_TOKEN);
  bot.startWebhook(`/${ICOBOT_TOKEN}`, null, 8443);
}

console.log(`Server is listening to localhost:${PORT}`);


process.on('unhandledRejection', (e) => {
  console.log(e);
});

process.on('uncaughtException', (e) => {
  console.log(e);
});
