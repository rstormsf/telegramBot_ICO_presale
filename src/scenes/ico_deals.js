const TelegrafFlow = require('telegraf-flow')
const { WizardScene, enter } = TelegrafFlow;
const { Extra, Markup } = require('telegraf')
const { getSyndicateCount, getSyndicates } = require('../helpers/db');

const icoDealsScene = new WizardScene('ico-deals',
  async (ctx) => {
    let syndicateList = [];
    let syndicateCount = await getSyndicateCount(ctx.from.username);
    let data = await getSyndicates(ctx.from.username);
    await data.forEach(function(syndicate) {
      let key = syndicate.key;
      syndicateList.push(key);
    });
    console.log(syndicateList);
    let msg = `Currently you are a member of ${syndicateCount} syndicate(s)\n`;
    if (syndicateCount > 0) {
      ctx.reply(`${msg}Syndicates:\n` + syndicateList.join(", "));
      // keyboard mapping not working
      // ctx.reply(`Please select a syndicate`, Extra.HTML().markup((m) => {
      //   let syndicates = syndicateList.map(({ name }) => {
      //     return m.callbackButton(name, name)
      //   })
      //   return m.inlineKeyboard(syndicates);
      // }));
      // ctx.flow.wizard.next();
    } else {
      ctx.reply(`Please join a syndicate in order to participate`);
      ctx.flow.leave()
    }
  },
  (ctx) => {
    ctx.flow.leave()
  },
)

module.exports = icoDealsScene;
