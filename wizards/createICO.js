const TelegrafFlow = require('telegraf-flow')
const { WizardScene, enter } = TelegrafFlow;
const { Extra, Markup } = require('telegraf')
const moment = require('moment')
const createICO = new WizardScene('create-ico',
// STEP 0
(ctx) => {
    ctx.replyWithMarkdown('Lets create an ICO, Please provide the name for your ICO:');
    ctx.flow.wizard.next()
},
// STEP 1
(ctx) => {
    let icoName
    if(ctx.message){
         icoName = ctx.message.text;
    }
    if (ctx.message && icoName.length === 1) {
        ctx.flow.wizard.selectStep(0);
        return ctx.flow.reenter('create-ico');
    }
    ctx.flow.state.icoName = icoName;
    if(ctx.session.icos[icoName] ) {
        ctx.replyWithMarkdown(`*Name already exists*
        *${icoName}*
        `)
        ctx.flow.wizard.selectStep(0);
        return ctx.flow.reenter('create-ico');
    }
    
    ctx.reply('Please choose a currency in which the ICO will be contributed <b>ETH</b> or <i>BTC</i>', Extra.HTML().markup((m) =>
    m.inlineKeyboard([
      m.callbackButton('ETH', 'ETH'),
      m.callbackButton('BTC', 'BTC')
    ])))
    ctx.flow.wizard.next()
},
// STEP 2
(ctx) => {
    if (!ctx.flow.state.currency || ctx.message && ctx.message.text.length > 0) {
        ctx.flow.wizard.selectStep(1);
        return ctx.flow.reenter('create-ico');
    } else {
        if(!ctx.flow.state.currency && ctx.message){
            ctx.flow.state.currency = ctx.callbackQuery.data;
        }
        ctx.reply(`Max Cap in ${ctx.flow.state.currency}`)
        ctx.flow.wizard.next()
    }
},
// STEP 3
(ctx) => {
    if (!ctx.flow.state.maxCap || ctx.message && !Number.isInteger(Number(ctx.message.text))) {
        ctx.flow.wizard.selectStep(2);
        return ctx.flow.reenter('create-ico');
    } else {
        if(!ctx.flow.state.maxCap && ctx.message){
            ctx.flow.state.maxCap = ctx.message.text;
        }
        ctx.reply(`Start Date and Time in following format month/day/year hour:minute UTC time zone.\n Example: 12/31/2017 15:31`)
        ctx.flow.wizard.next()
    }
},
// STEP 4
(ctx) => {
    if(!ctx.flow.state.startTime && ctx.message){
        let startTime = moment.utc(ctx.message.text, "MM-DD-YYYY HH:mm")
        if(startTime.toString() !== 'Invalid date'){
            ctx.flow.state.startTime = startTime.format();
        }
    }
    if(!ctx.flow.state.startTime){
        ctx.flow.wizard.selectStep(3);
        return ctx.flow.reenter('create-ico');
    } else {
        ctx.reply(`End Date and Time in the following format month/day/year hour:minute UTC time zone.\n Example: 12/31/2017 15:31`)
        ctx.flow.wizard.next()
    }
},
// STEP 5
(ctx) => {
    if(!ctx.flow.state.endTime && ctx.message){
        let endTime = moment.utc(ctx.message.text, "MM-DD-YYYY HH:mm")
        if(endTime.toString() !== 'Invalid date' && endTime.isAfter(ctx.flow.state.startTime)) {
            ctx.flow.state.endTime = endTime.format();
        }
    }
    if(!ctx.flow.state.endTime){
        ctx.flow.wizard.selectStep(4);
        return ctx.flow.reenter('create-ico');
    } else {
        ctx.reply(`Please Confirm:
            Name: <b>${ctx.flow.state.icoName}</b>
            Max Cap <b>${ctx.flow.state.maxCap} ${ctx.flow.state.currency}</b>
            Start <b>${moment.utc(ctx.flow.state.startTime).format("dddd, MMMM Do YYYY, h:mm:ss a")} GMT</b>
            End<b> ${moment.utc(ctx.flow.state.endTime).format("dddd, MMMM Do YYYY, h:mm:ss a")} GMT</b>
            Currency <b>${ctx.flow.state.currency}</b>
            `, Extra.HTML().markup((m) =>
            m.inlineKeyboard([
            m.callbackButton('Yes', 'Yes'),
            m.callbackButton('No', 'No'),
        ])))
        ctx.flow.wizard.next()
    }
},
(ctx) => {
    if(ctx.callbackQuery && ctx.callbackQuery.data === 'Yes'){
        const {icoName, maxCap, startTime, endTime, currency} = ctx.flow.state;
        ctx.session.icos[icoName] = {
            maxCap, startTime, endTime, currency
        }
        ctx.reply(`ICO saved\n /start`)
        ctx.session._flow = null;
    } else {
        ctx.reply(`Your ICO was not created`)
        ctx.session._flow = null;
    }
},
)
module.exports = createICO;
