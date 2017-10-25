const start = require('../scenes/start');
const addICOScene = require('../scenes/addICO');
const icoDealsScene = require('../scenes/ico_deals');
const manageMembersScene = require('../scenes/manage_members');
const TelegrafFlow = require('telegraf-flow');
const flow = new TelegrafFlow();


flow.command('start', async (ctx, next) => {
  await ctx.flow.enter('start');
});

flow.hears('👥 Add ICO', ctx => ctx.flow.enter('add-ico'));
flow.hears('🤳 Manage Members', ctx => ctx.flow.enter('manage-members'));
flow.hears('🔍 ICO Deals', ctx => ctx.flow.enter('ico-deals'));

flow.register(start);
flow.register(addICOScene);
flow.register(manageMembersScene);
flow.register(icoDealsScene);

module.exports = flow.middleware();