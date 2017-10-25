const { Scene } = require('telegraf-flow')
const { isAdmin } = require('../database/admin');
const { Extra, Markup } = require('telegraf');

const startScene = new Scene('start');

startScene.enter(async (ctx) => {
  let isUserAdmin = await isAdmin(ctx.from.username);
  ctx.reply('Hi there, please choose an option', Markup
    .keyboard([
      ['🔍 ICO Deals', '😎 Almost Closed <1hr'],
      ['☸ Participate', '⭐️ My balance', '📢 Check Tx'],
      isUserAdmin ? ['🤳 Manage Members', '👥 Add ICO'] : []
    ])
    .oneTime()
    .resize()
    .extra()
    );
  ctx.flow.leave();
});

module.exports = startScene;