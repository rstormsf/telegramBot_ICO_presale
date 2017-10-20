const { branch } = require('telegraf');
const { isUserAuthorized } = require('../helpers/db');

module.exports = branch(isUserAuthorized, async (ctx, next) => {
  await next();
}, async (ctx) => {
  await ctx.flow.enter('auth');
});
