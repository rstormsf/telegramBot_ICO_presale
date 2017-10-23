const createICOScene = require('../scenes/createICO');
// const auth = require('./auth');
const TelegrafFlow = require('telegraf-flow');
const { Scene } = TelegrafFlow;
const { Extra, Markup } = require('telegraf');
const { createUserById } = require('../helpers/db.js');
const flow = new TelegrafFlow();



// create a scene
const start = new Scene('startScene');

// define what happens when you enter scene
start.enter(async (ctx) => {
  // await createUserById(ctx.from.id);
  isUserAdmin = true;
  ctx.reply('Hi there, please choose an option', Markup
    .keyboard([
      ['🔍 ICO Deals', '😎 Almost Closed <1hr'], // Row1 with 2 buttons
      ['☸ Participate', '⭐️ My balance', '📢 Check Tx'], // Row2 with 2 buttons
      isUserAdmin ? ['📢 My syndicates', '🤳 Manage Members', '👥 Add ICO'] : []
    ])
    .oneTime()
    .resize()
    .extra()
    );
  ctx.flow.leave();
});

// when /start is called, enter scene
flow.command('start', async (ctx, next) => {
  await ctx.flow.enter('startScene')
});

flow.hears('👥 Add ICO', ctx => ctx.flow.enter('createICO'));

flow.register(start);
flow.register(createICOScene);

module.exports = flow.middleware();