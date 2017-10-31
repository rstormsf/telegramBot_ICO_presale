const TelegrafFlow = require('telegraf-flow')
const { WizardScene } = TelegrafFlow;
const { Extra, Markup } = require('telegraf')
const { getSyndicateCount, getSyndicates } = require('../database/syndicate');
const { getAllICO, getICOByName } = require('../database/deal');
const getDealExchangeRate = require('../contract/getDealExchangeRate');

const icoDealsScene = new WizardScene('ico-deals',
  async (ctx) => {
    let syndicateList = [];
    let syndicateCount = await getSyndicateCount(ctx.from.username);
    let data = await getSyndicates(ctx.from.username);
    await data.forEach(function(syndicate) {
      let key = syndicate.key;
      syndicateList.push(key);
    });
    syndicateList.push('Last');
    console.log(syndicateList);
    let msg = `Currently you are a member of ${syndicateCount} syndicate(s)\n`;
    if (syndicateCount > 0) {
      ctx.reply(`Please select a syndicate`, Extra.HTML().markup((m) => {
        return m.inlineKeyboard(syndicateList.map((name) => {
          if (name == 'Last') {
            return m.callbackButton('Cancel', 'CANCEL');
          } else {
            return m.callbackButton(name, name)
          }
        }))
      }));
      ctx.flow.wizard.next();
    } else {
      ctx.reply(`Please join a syndicate in order to participate`);
      ctx.flow.leave()
    }
  },
  async (ctx) => {
    if (ctx.callbackQuery) {
      ctx.flow.state.syndicate = ctx.callbackQuery.data;
      let ICOList = [];
      let data = await getAllICO(ctx.flow.state.syndicate);
      if (data == null) {
        await ctx.reply(`${ctx.flow.state.syndicate} currently has no active deals`)
        await ctx.flow.enter('start');
      } else {
        await data.forEach(function(deal) {
          let key = deal.key;
          ICOList.push(key);
        });
        ICOList.push('Last');
        ctx.reply(`Select a Deal`, Extra.HTML().markup((m) => {
          return m.inlineKeyboard(ICOList.map((name) => {
            if (name == 'Last') {
              return m.callbackButton('Cancel', 'CANCEL');
            } else {
              return m.callbackButton(name, name)
            }
          }));
        }));
        ctx.flow.wizard.next();
      }
    }
  },
  async (ctx) => {
    if (ctx.callbackQuery) {
      ctx.flow.state.deal = ctx.callbackQuery.data;
      let dealInfo = await getICOByName(ctx.flow.state.syndicate, ctx.flow.state.deal);
      let exchangeRate = await getDealExchangeRate(ctx.flow.state.syndicate, ctx.flow.state.deal);
      await ctx.reply(`Contract Address: ${dealInfo.contractAddress}\n` + 
        `Max Cap: ${dealInfo.maxCap} eth\n` + 
        `Start: ${dealInfo.startTime}\n` +
        `End: ${dealInfo.endTime}\n` + 
        `Exchange Rate: ${exchangeRate} eth`
      );
      await ctx.flow.leave();
    }
  }
)

module.exports = icoDealsScene;
