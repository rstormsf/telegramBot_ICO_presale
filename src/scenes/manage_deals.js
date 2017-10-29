const { Scene } = require('telegraf-flow')
const { Extra, Markup } = require('telegraf');
const manageDealsScene = new Scene('manage-deals');

manageDealsScene.enter(async (ctx) => {
  ctx.reply('Manage Deals', Markup
    .keyboard([
      ['⬅️ Back', '🔁 Set Exchange Rate'],
      ['📗 Investor Balances', '💰 Add Deal']
    ])
    .oneTime()
    .resize()
    .extra()
    );
  ctx.flow.leave();
});

module.exports = manageDealsScene;
