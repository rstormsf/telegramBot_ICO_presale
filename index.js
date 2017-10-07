const Telegraf = require('telegraf');
const { Extra, Markup } = require('telegraf');

const app = new Telegraf(process.env.BOT_TOKEN)
app.context.db = {
    getTime: () => { return new Date() }
}
app.use((ctx, next) => {
    const start = new Date()
    return next(ctx).then(() => {
        const ms = new Date() - start
        console.log('Response time %sms', ms)
    })
})
const replyOptions = Markup.inlineKeyboard([
    Markup.urlButton('❤️', 'http://telegraf.js.org'),
    Markup.callbackButton('Delele', 'delete')
  ]).extra()

app.on('start', ({ reply }) =>
reply('One time keyboard', Markup
  .keyboard(['/simple', '/inline', '/pyramid'])
  .oneTime()
  .resize()
  .extra()
)
)
app.command('start', ({ from, reply, db }) => {
        console.log('start', from);
        return reply('Welcome! ' + from.first_name + ' currentTime:' + db.getTime());
    })
app.hears('hi', (ctx) => ctx.reply('Hey there!'))
app.on('sticker', (ctx) => ctx.reply('👍'))


app.on('message', (ctx) => ctx.telegram.sendCopy(ctx.from.id, ctx.message, replyOptions))
app.action('delete', ({ deleteMessage }) => deleteMessage())

app.startPolling()




