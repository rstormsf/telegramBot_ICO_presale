const TelegrafFlow = require('telegraf-flow')
const { WizardScene, enter } = TelegrafFlow;
const { Extra, Markup } = require('telegraf')
const db = require('../firebase.config');

let membersCached = [];
async function getMembers(from) {
    const members = await db.ref(`sessions/admins/${from}/members`).once('value');
    return members.val();
}

async function addMember(from, handle) {
    await db.ref(`sessions/admins/${from}/members/${membersCached.length}`).set(handle);
}

const manageMembers = new WizardScene('manage-members',
    (ctx) => {
        getMembers(ctx.from.username).then((members) => {
            membersCached = members;
            let msg = `Currently have ${members.length} members in your syndicate\n`;
            ctx.reply(`${msg}Please choose your action: `, Extra.HTML().markup((m) =>
            m.inlineKeyboard([
              m.callbackButton('Add', 'Add'),
              m.callbackButton('Remove', 'Remove'),
              m.callbackButton('View All', 'View All')
            ])))
        })
        ctx.flow.wizard.next()

    },
    (ctx) => {
        switch(ctx.callbackQuery.data) {
            case 'Add':
            case 'Remove':
                ctx.reply(`Please provide telegram handle without @. Example: rstormsf `);
                ctx.flow.wizard.next()
                break;
            case 'View All':
                ctx.reply(...membersCached)
                ctx.flow.wizard.next()
                break;
            default:
                ctx.reply(`Incorrect input. Please try again `);
                break;
        }
    },
    (ctx) => {

        // const session = new LocalSession({ database: `sessions/${ctx.message.text}.json` });
        // session.DB.get('sessions[0].data.membership').push({name: ctx.from.username}).write()
        ctx.flow.leave()

    }
)
module.exports = manageMembers;
