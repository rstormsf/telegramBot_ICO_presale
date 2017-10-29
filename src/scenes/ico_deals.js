const TelegrafFlow = require('telegraf-flow')
const { WizardScene } = TelegrafFlow;
const { Extra, Markup } = require('telegraf')
const { getSyndicateCount, getSyndicates } = require('../database/syndicate');

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
      ctx.reply(`Please select a syndicate`, Extra.HTML().markup((m) => {
        return m.inlineKeyboard(syndicateList.map((name) => {
          return m.callbackButton(name, name)
        }));
      }));
      ctx.flow.wizard.next();
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
