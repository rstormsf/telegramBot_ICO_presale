const TelegrafFlow = require('telegraf-flow')
const { WizardScene, enter } = TelegrafFlow;
const { Extra, Markup } = require('telegraf')

const manageMembers = new WizardScene('manage-members',
    (ctx) => {
        if (ctx.session.members && ctx.session.members.length) {
            membersCount = ctx.session.members.length;
        }
        let msg = `Currently have ${membersCount} members in your syndicate\n`;
        ctx.reply(`${msg}Please choose your action: `, Extra.HTML().markup((m) =>
        m.inlineKeyboard([
          m.callbackButton('Add', 'Add'),
          m.callbackButton('Remove', 'Add')
        ])))
        ctx.flow.wizard.next()

    },
    (ctx) => {
        ctx.reply(`Please provide telegram handle without. Example: rstormsf `);
        if(ctx.callbackQuery.data === 'Add'){
            
        }
        ctx.flow.wizard.next()
    },
    (ctx) => {

        const session = new LocalSession({ database: `sessions/${ctx.message.text}.json` });
        session.DB.get('sessions[0].data.membership').push({name: ctx.from.username}).write()
        ctx.flow.leave()

    }
)
module.exports = manageMembers;
