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

const manageMembersScene = new WizardScene('manage-members',
  // Step 0
  async (ctx) => {
    const memberCount = await getMemberCount(ctx.from.username);
    let msg = `Currently have ${memberCount} members in your syndicate\n`;
    ctx.reply(`${msg}Please choose your action: `, Extra.HTML().markup((m) =>
      m.inlineKeyboard([
        m.callbackButton('Add', 'Add'),
        m.callbackButton('Remove', 'Remove'),
        m.callbackButton('View All', 'View All')
      ])
    ));
    ctx.flow.wizard.next()
  },
  // Step 1
  async (ctx) => {
    switch(ctx.callbackQuery.data) {
      case 'Add':
        ctx.flow.state.action = 'Add';
        ctx.reply(`Please provide telegram handle to add without @. Example: rstormsf `);
        ctx.flow.wizard.next()
        break;
      case 'Remove':
        ctx.flow.state.action = 'Remove';
        ctx.reply(`Please provide telegram handle to remove without @. Example: rstormsf `);
        ctx.flow.wizard.next()
        break;
      case 'View All':
        let members = await getMembers(ctx.from.username);
        let memberList = [];
        await members.forEach(function(member) {
          let key = member.key;
          memberList.push(key);
        });
        ctx.reply('Members: \n' + memberList.join(", "));
        ctx.flow.leave();
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
      ctx.flow.leave();
    }
  }
)
module.exports = manageMembersScene;
