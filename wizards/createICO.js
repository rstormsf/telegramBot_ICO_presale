const TelegrafFlow = require('telegraf-flow')
const { WizardScene, enter } = TelegrafFlow;
const { Extra, Markup } = require('telegraf')

let icoCount = 0;
const createICO = new WizardScene('create-ico',
(ctx) => {
    if(ctx.session.icos && ctx.session.icos.length){
        icoCount = ctx.session.icos.length;
    } else {
        ctx.session.icos = [];
    }
    ctx.session.icos.push({});
    ctx.reply('Lets create an ICO, Please provide the name for your ICO:');
    ctx.flow.wizard.next()
},
(ctx) => {
    if (ctx.message && ctx.message.text.length === 1) {
        ctx.flow.wizard.selectStep(0);
        return ctx.flow.reenter('create-ico');
    }
    ctx.session.icos[icoCount].icoName = ctx.message.text;
    // ctx.reply('Please provide a currency in which the ICO will be held?')
    ctx.reply('Please choose a currency in which the ICO will be contributed <b>ETH</b> or <i>BTC</i>', Extra.HTML().markup((m) =>
    m.inlineKeyboard([
      m.callbackButton('ETH', 'ETH'),
      m.callbackButton('BTC', 'BTC')
    ])))
    ctx.flow.wizard.next()
},
(ctx) => {
    if (ctx.message && ctx.message.text.length > 0) {
        ctx.flow.wizard.selectStep(1);
        return ctx.flow.reenter('create-ico');
    }
    ctx.session.icos[icoCount].currency = ctx.callbackQuery.data;
    ctx.reply(`Max Cap in ${ctx.callbackQuery.data}`)
    ctx.flow.wizard.next()
},
(ctx) => {
    if (ctx.message && !Number.isInteger(Number(ctx.message.text))) {
        ctx.flow.wizard.selectStep(2);
        return ctx.flow.reenter('create-ico');
    }
    ctx.session.icos[icoCount].maxCap = ctx.message.text;
    ctx.reply(`Time Starts in following format month/day/year hour:minute UTC. Example: 12/31/2017 15:31`)
    ctx.flow.wizard.next()
},
(ctx) => {
    ctx.session.icos[icoCount].startTime = ctx.message.text;
    ctx.reply(`Time ENDs following format month/day/year hour:minute UTC. Example: 12/31/2017 15:31`)
    ctx.flow.wizard.next()
},
(ctx) => {
    ctx.session.icos[icoCount].endTime = ctx.message.text;
    ctx.reply(`Confirm? ${JSON.stringify(ctx.session.icos[icoCount], null, '\n')}`, Extra.HTML().markup((m) =>
    m.inlineKeyboard([
      m.callbackButton('Yes', 'Yes'),
      m.callbackButton('No', 'No')
    ])))
    ctx.flow.wizard.next()
},
(ctx) => {
    if(ctx.callbackQuery.data === 'Yes'){
        ctx.reply(`Here is your ICO info: ${JSON.stringify(ctx.session.icos[icoCount])}`)
        ctx.flow.leave()
    } else {
        ctx.reply(`Your ICO was not created: ${JSON.stringify(ctx.session.icos[icoCount])}`)
        ctx.session.icos.pop();
        ctx.flow.leave()
    }
},
)
module.exports = createICO;
