const Telegraf = require('telegraf')
const TelegrafFlow = require('telegraf-flow')
const firebaseSession = require('telegraf-session-firebase')
const admin = require('firebase-admin')
const debug = require('debug')('app:app')
const { Extra, Markup } = require('telegraf')


const serviceAccount = require('./presalesyndicator-firebase-adminsdk-k84po-fd5442124f.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://presalesyndicator.firebaseio.com'
})
const database = admin.database()

const app = new Telegraf(process.env.BOT_TOKEN)
app.use(firebaseSession(database.ref('sessions')))

async function isAdmin(from) {
    const admins = await database.ref(`sessions/admins/${from}/status`).once('value');
    return admins.val();
}
app.command('start', async ({ session, reply, from }) => {
    console.log(from);
    let isUserAdmin = await isAdmin(from.username);
    return reply('Hi there, please choose an option', Markup
        .keyboard([
            ['🔍 ICO Deals', '😎 Almost Closed <1hr'], // Row1 with 2 buttons
            ['☸ Participate', '⭐️ My balance', '📢 Check Tx'], // Row2 with 2 buttons
            isUserAdmin ? ['📢 My syndicates', '/manageMembers', '👥 Add ICO'] : []
        ])
        .oneTime()
        .resize()
        .extra()
    )
})

const createICO = require('./wizards/createICO');
const newS = require('./wizards/newS');
const ico_deals = require('./wizards/ico_deals');
const manage_members = require('./wizards/manage_members');
const { WizardScene, enter } = TelegrafFlow
const flow = new TelegrafFlow();
flow.register(createICO)
// flow.register(ico_deals)
// flow.register(manage_members)
// flow.register(newS)



app.use(flow.middleware())
app.hears('/stats', ({ reply, session, from }) => reply(`${session.icos} messages from ${from.username}`))

app.hears('👥 Add ICO', ({ session, flow }) => {
    console.log(session);
    if (session._flow) {
        session._flow._state = null;
    }
    if (!session.icos) {
        session.icos = { "INITIALIZED": true }
    }
    flow.enter('create-ico')
})
app.hears('🔍 ICO Deals', enter('ico-deals'))
app.hears('🤳 Manage Members', ({ reply }) => {
    reply('/manageMembers')
})
// bot.hears('/stats', ({ reply, session, from }) => reply(`${session.counter} messages from ${from.username}`))

app.command('/manageMembers', enter('manage-members'))
app.command('/test', (ctx) => {
    ctx.reply('sdf',
        Extra.HTML().markup((m) => {
            console.log(m);
            // return m.button('sdfsd');
            return m.inlineKeyboard([
                // m.button('sdfsdf'),
                m.urlButton('❤️', 'http://telegraf.js.org'),
                m.callbackButton('Yes', 'Yes'),
                m.callbackButton('No', 'No'),
            ])
        }
        ))
})
app.startPolling()