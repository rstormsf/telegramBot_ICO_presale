const createICOScene = require('../scenes/createICO');
// const auth = require('./auth');
const TelegrafFlow = require('telegraf-flow');
const { Scene } = TelegrafFlow;
const { Extra, Markup } = require('telegraf');
const { createUserById } = require('../helpers/db.js');
const flow = new TelegrafFlow();

const start = new Scene('startScene');

start.enter(async (ctx) => {
  // await createUserById(ctx.from.id);
  isUserAdmin = true;
  ctx.reply('Hi there, please choose an option', Markup
    .keyboard([
      ['🔍 ICO Deals', '😎 Almost Closed <1hr'],
      ['☸ Participate', '⭐️ My balance', '📢 Check Tx'],
      isUserAdmin ? ['📢 My syndicates', '🤳 Manage Members', '👥 Add ICO'] : []
    ])
    .oneTime()
    .resize()
    .extra()
    );
  ctx.flow.leave();
});

flow.command('start', async (ctx, next) => {
  await ctx.flow.enter('startScene')
});

flow.hears('👥 Add ICO', ctx => ctx.flow.enter('createICO'));

flow.register(start);
flow.register(createICOScene);

module.exports = flow.middleware();