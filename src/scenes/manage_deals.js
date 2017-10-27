const { Scene } = require('telegraf-flow')
const { Extra, Markup } = require('telegraf');

const startScene = new Scene('start');

startScene.enter(async (ctx) => {
  let isUserAdmin = await isAdmin(ctx.from.username);
  let isLinked = await isAccountLinked(ctx.from.username);
  console.log(isLinked);
  ctx.reply('Manage Deals', Markup
    .keyboard([
      ['⬅️ Back', '🔁 Set Exchange Rate', '📢 Check Tx'],
      ['📗 Investor Balances', '💰 Add Deal']
    ])
    .oneTime()
    .resize()
    .extra()
    );
  ctx.flow.leave();
});

module.exports = startScene;

startScene.hears()