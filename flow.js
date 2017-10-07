const Telegraf = require('telegraf')
const TelegrafFlow = require('telegraf-flow')
const firebaseSession = require('telegraf-session-firebase')
const admin = require('firebase-admin')
const LocalSession = require('telegraf-session-local')
const debug = require('debug')('app:app')
const { Extra, Markup } = require('telegraf')


// const serviceAccount = require('./presalesyndicator-firebase-adminsdk-k84po-fd5442124f.json');
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: 'https://presalesyndicator.firebaseio.com'
// })
// const database = admin.database()


const app = new Telegraf(process.env.BOT_TOKEN)
app.command('start', ({ reply }) => {
    return reply('Hi there, please choose an option', Markup
      .keyboard([
        ['🔍 ICO Deals', '😎 Almost Closed <1hr'], // Row1 with 2 buttons
        ['☸ Participate', '⭐️ My balance','📢 Check Tx'], // Row2 with 2 buttons
        ['📢 My syndicates',  '/manageMembers', '👥 Add ICO'] // Row3 with 3 buttons
      ])
      .oneTime()
      .resize()
      .extra()
    )
    })

app.use((ctx, next) => {
    const session = new LocalSession({ database: `sessions/${ctx.from.username}.json` }).middleware();
    return session(ctx, next);
})
const createICO = require('./wizards/createICO');
const ico_deals = require('./wizards/ico_deals');
const manage_members = require('./wizards/manage_members');
const { WizardScene, enter } = TelegrafFlow
const flow = new TelegrafFlow()
flow.register(createICO)
flow.register(ico_deals)
flow.register(manage_members)
// app.use(firebaseSession(database.ref('sessions')))


app.use(flow.middleware())
app.on('text', (ctx, next) => {
    ctx.session.counter = ctx.session.counter || 0
    ctx.session.counter++
    return next()
})
app.hears('/stats', ({ reply, session, from }) => reply(`${session.counter} messages from ${from.username}`))

app.hears('👥 Add ICO', enter('create-ico'))
app.hears('🔍 ICO Deals', enter('ico-deals'))
app.hears('🤳 Manage Members', ({reply}) => {
    reply('/manageMembers')
})

app.command('/manageMembers', enter('manage-members'))
app.startPolling()