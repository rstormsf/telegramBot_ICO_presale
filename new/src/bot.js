const Telegraf = require('telegraf');
const error = require('./middleware/error');
const user = require('./middleware/user');
const session = require('./middleware/session');
const logger = require('./middleware/logger');
const scenes = require('./middleware/scenes');
const { ICOBOT_TOKEN } = require('../config');
require('./db');

const bot = new Telegraf(ICOBOT_TOKEN);

bot.context.user = null;

// setImmediate(async () => {
//   try {
//     const data = await bot.telegram.getMe();
//     bot.options.username = data.username;
//   } catch (e) {
//     console.log(e.message);
//   }
// });

// bot.use(error);
// bot.use(user);
// bot.use(session);
// bot.use(logger);
// bot.use(scenes);
bot.command('start', ({ session, reply, from }) => {
  console.log('asdf');
  return reply('Hi there, please choose an option');
})

bot.hears('apple', async (ctx) => {
  return ctx.reply('If you are confused type /help');
});


bot.on('text', async (ctx) => {
  console.log('asdf');
  return ctx.reply('If you are confused type /help');
});


bot.catch((e) => {
  console.log(e);
});

module.exports = bot;