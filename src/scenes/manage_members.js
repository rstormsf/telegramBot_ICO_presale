const TelegrafFlow = require('telegraf-flow')
const { WizardScene } = TelegrafFlow;
const { Extra, Markup } = require('telegraf')
const { 
  addMember, 
  removeMember,  
  getMembers, 
  getMemberCount,
  getMemberByName 
} = require('../database/member');
const { isAccountLinked } = require('../database/linkAccount');

async function viewAllMembers(members) {
  let output = '';
  for (let member in members) {
    let row = member;
    // row += ': IsLinked? ';
    let isLinked = await isAccountLinked(member);
    row += isLinked ? ' / yes\n' : ' / no\n';
    output += row;
  };
  return output;
}

const manageMembersScene = new WizardScene('manage-members',
  // Step 0
  async (ctx) => {
    const memberCount = await getMemberCount(ctx.from.username);
    let msg = `Currently have ${memberCount} members in your syndicate\n`;
    ctx.reply(`${msg}Please choose your action: `, Extra.HTML().markup((m) =>
      m.inlineKeyboard([
        m.callbackButton('Add', 'Add'),
        m.callbackButton('Remove', 'Remove'),
        m.callbackButton('View All', 'View All'),
        m.callbackButton('Cancel', 'CANCEL')
      ])
    ));
    ctx.flow.wizard.next()
  },
  // Step 1
  async (ctx) => {
    switch(ctx.callbackQuery.data) {
      case 'Add':
        ctx.flow.state.action = 'Add';
        ctx.reply(`Please provide telegram handle to add without @. Example: rstormsf `, Markup.inlineKeyboard([
          Markup.callbackButton('Cancel', 'CANCEL'),
        ]).extra());
        ctx.flow.wizard.next()
        break;
      case 'Remove':
        ctx.flow.state.action = 'Remove';
        ctx.reply(`Please provide telegram handle to remove without @. Example: rstormsf `, Markup.inlineKeyboard([
          Markup.callbackButton('Cancel', 'CANCEL'),
        ]).extra());
        ctx.flow.wizard.next()
        break;
      case 'View All':
        let members = await getMembers(ctx.from.username);
        let output = await viewAllMembers(members.val());
        await ctx.reply('Member / Linked?\n' + output);
        ctx.flow.wizard.selectStep(0);
        await ctx.flow.reenter('manage-members');
        break;
      default:
        ctx.reply(`Incorrect input. Please try again `);
        break;
    }
  },
  async (ctx) => {
    if (ctx.message) {
      let user = ctx.message.text;
      let member = await getMemberByName(ctx.from.username, user);
      let isMember = (member.val() === null) ? false : true;
      if (ctx.flow.state.action == 'Add') {
        if (isMember) {
          ctx.reply(`${user} is already a member!`);
        } else {
          await addMember(ctx.from.username, user);
          ctx.reply(`${user} added!`);
        }
      } else if (ctx.flow.state.action == 'Remove') {
        if (!isMember) {
          ctx.reply(`${user} is not a member.`);          
        } else {
          await removeMember(ctx.from.username, user);
          ctx.reply(`${user} removed!`);      
        }
      }
      ctx.flow.wizard.selectStep(0);
      await ctx.flow.reenter('manage-members');
    }
  }
)
module.exports = manageMembersScene;
