const User = require('../models/user');

module.exports = async (ctx, next) => {
  await console.log('user');
  ctx.user = await User.findById(ctx.from.id);
  await next();
};
