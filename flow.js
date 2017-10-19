const Telegraf = require('telegraf')
const TelegrafFlow = require('telegraf-flow')
const firebaseSession = require('telegraf-session-firebase')
const admin = require('firebase-admin')
const debug = require('debug')('app:app')
const { Extra, Markup } = require('telegraf')
require('dotenv').config();

admin.initializeApp({
    credential: admin.credential.cert({
        type: process.env.type,
        project_id: process.env.project_id,
        private_key_id: process.env.private_key_id,
        private_key: JSON.parse(process.env.private_key),
        client_email: process.env.client_email,
        client_id: process.env.client_id,
        auth_uri: process.env.auth_uri,
        token_uri: process.env.token_uri,
        auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
        client_x509_cert_url: process.env.client_x509_cert_url
    }),
    databaseURL: process.env.databaseURL
})
const database = admin.database()

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
    console.log(from);
    let isUserAdmin = await isAdmin(from.username);
    login(from);
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
const ico_deals = require('./wizards/ico_deals');
const manage_members = require('./wizards/manage_members');
const { WizardScene, enter } = TelegrafFlow
const flow = new TelegrafFlow();
flow.register(createICO)
flow.register(ico_deals)
flow.register(manage_members)



app.use(flow.middleware())

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
// app.hears('🔍 ICO Deals', enter('ico-deals'))
// app.hears('🤳 Manage Members', ({ reply }) => {
//     reply('/manageMembers')
// })

// app.command('/manageMembers', enter('manage-members'))
app.startPolling()