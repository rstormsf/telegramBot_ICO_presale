const Telegraf = require('telegraf')
const { Extra, Markup } = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.use(Telegraf.log())

// Register logger middleware
bot.use((ctx, next) => {
    ctx.reply(`Hi,${ctx.message.from.first_name} type /start`)
    return next();
  })

bot.command('start', ({ reply }) => {
return reply('Custom buttons keyboard', Markup
  .keyboard([
    ['🔍 ICO Deals', '😎 Almost Closed <1hr'], // Row1 with 2 buttons
    ['☸ Participate', '📞 Feedback'], // Row2 with 2 buttons
    ['📢 Check Tx', '⭐️ My balance', '👥 Add ICO'] // Row3 with 3 buttons
  ])
  .oneTime()
  .resize()
  .extra()
)
})

bot.on('text', (ctx) => {
    console.log(ctx.message.text);
    if(ctx.message.text === '👥 Share') {
        ctx.reply("SUKA")
    }
})
bot.startPolling()
