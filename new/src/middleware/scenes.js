const TelegrafFlow = require('telegraf-flow');
const createICOScene = require('../scenes/createICO');
const auth = require('./auth');

const flow = new TelegrafFlow();

flow.hears('👥 Add ICO', auth, ctx => ctx.flow.enter('createICO'));


async function start(ctx) {
  await createUserById(ctx.from.id);
  await ctx.reply(`Hello, ${ctx.from.first_name}!\n\n`,
    GLOBAL_KEYBOARD);
}

flow.command('start', async (ctx, next) => {
  console.log('asdf')
  if (ctx.user) {
    await next();
    return;
  }
  await start(ctx, next);
});

flow.register(createICOScene);

module.exports = flow.middleware();