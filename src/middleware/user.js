const { login } = require('../helpers/db');

module.exports = async (ctx, next) => {
  await login(ctx.from.username);
  await next();
};
