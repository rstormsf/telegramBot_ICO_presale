const start = require('../scenes/start');
const addICOScene = require('../scenes/add_ICO');
const addFundsScene = require('../scenes/add_funds');
const icoDealsScene = require('../scenes/ico_deals');
const manageMembersScene = require('../scenes/manage_members');
const linkAccountScene = require('../scenes/link_account');
const manageDealsScene = require('../scenes/manage_deals');
const setExchangeRateScene = require('../scenes/set_exchange_rate');
const TelegrafFlow = require('telegraf-flow');
const flow = new TelegrafFlow();


flow.command('start', async (ctx, next) => {
  await ctx.flow.enter('start');
});

flow.hears('🤳 Manage Members', ctx => ctx.flow.enter('manage-members'));
flow.hears('🔍 ICO Deals', ctx => ctx.flow.enter('ico-deals'));
flow.hears('🔗 Link Account', ctx => ctx.flow.enter('link-account'));
flow.hears('💵 Add Funds', ctx => ctx.flow.enter('add-funds'));
flow.hears('📁 Manage Deals', ctx => ctx.flow.enter('manage-deals'));
flow.hears('💰 Add Deal', ctx => ctx.flow.enter('add-ico'));
flow.hears('🔁 Set Exchange Rate', ctx => ctx.flow.enter('set-exchange-rate'));
flow.hears('⬅️ Back', ctx => ctx.flow.enter('start'));

flow.register(start);
flow.register(addICOScene);
flow.register(manageMembersScene);
flow.register(icoDealsScene);
flow.register(linkAccountScene);
flow.register(addFundsScene);
flow.register(manageDealsScene);
flow.register(setExchangeRateScene);

module.exports = flow.middleware();