const Telegraf = require('telegraf')
const {Telegram} = require('telegraf')
const TelegrafFlow = require('telegraf-flow')
const firebaseSession = require('telegraf-session-firebase')
const database = require('./firebase.config');
const debug = require('debug')('app:app')
const { Extra, Markup } = require('telegraf')

const app = new Telegraf(process.env.BOT_TOKEN)
app.use(firebaseSession(database.ref('sessions')))

async function isAdmin(from) {
    const admins = await database.ref(`sessions/admins/${from}/status`).once('value');
    return admins.val();
}

async function login(from) {
    database.ref(`sessions/logins/${from.username}/`).set({ ...from, lastTime: Date.now() });
}
app.command('start', async ({ session, reply, from }) => {
    session._flow = null;
    let isUserAdmin = await isAdmin(from.username);

    login(from);
    return reply('Hi there, please choose an option', Markup
        .keyboard([
            ['🔍 ICO Deals', '😎 Almost Closed <1hr'], // Row1 with 2 buttons
            ['☸ Participate', '⭐️ My balance', '📢 Check Tx'], // Row2 with 2 buttons
            isUserAdmin ? ['📢 My syndicates', '🤳 Manage Members', '👥 Add ICO'] : []
        ])
        .oneTime()
        .resize()
        .extra()
    )
})

const createICO = require('./wizards/createICO');
const manageMembers = require('./wizards/manage_members');

const { WizardScene, enter } = TelegrafFlow
const flow = new TelegrafFlow();
flow.register(createICO)
flow.register(manageMembers)




app.use(flow.middleware())

app.hears('👥 Add ICO', async ({ session, flow, from, reply }) => {
    session._flow = null;
    let isUserAdmin = await isAdmin(from.username);
    if(isUserAdmin){
        if (!session.icos) {
            session.icos = { "INITIALIZED": true }
        }
        flow.enter('create-ico')
    } else{
        reply('you are not authorized')
    }
})
// app.hears('🔍 ICO Deals', enter('ico-deals'))
app.hears('🤳 Manage Members', async ({ reply, from, flow }) => {
    let isUserAdmin = await isAdmin(from.username);
    if(isUserAdmin){
        flow.enter('manage-members')
    } else {
        reply('you are not authorized')
    }
})

let t = new Telegram(process.env.BOT_TOKEN)

app.command('/addMember', (ctx) => {
    console.log(ctx);
  })
// app.command('/manageMembers', enter('manage-members'))
app.startPolling()