const User = require('../models/user');

module.exports = async (ctx, next) => {
  ctx.user = await User.findById(ctx.from.id);
  await next();
};
