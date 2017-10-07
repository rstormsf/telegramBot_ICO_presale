const TelegrafFlow = require('telegraf-flow')
const { WizardScene, enter } = TelegrafFlow;
const { Extra, Markup } = require('telegraf')

let membershipCount = 0;
const createICO = new WizardScene('ico-deals',
(ctx) => {
    if(ctx.session.membership && ctx.session.membership.length){
        membershipCount = ctx.session.membership.length;
    }
    let msg = `Currently you are a member of ${membershipCount} syndicates\n`;
    if(membershipCount){
        ctx.reply(`${msg}Please select a syndicate`, Extra.HTML().markup((m) => {
            let syndicates = ctx.session.membership.map(({name}) => {
                return m.callbackButton(name, name)
            })
            return m.inlineKeyboard(syndicates);
        }
    ))
        ctx.flow.wizard.next()
    } else {
        ctx.reply(`${msg}Please join a syndicate in order to participate`);
        ctx.flow.leave()
    }
},
(ctx) => {
    ctx.flow.leave()
},
)
module.exports = createICO;
