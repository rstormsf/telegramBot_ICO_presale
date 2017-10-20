module.exports = async(ctx, next) => {
  try {
    console.log('asdf');
    await next();
  } catch (e) {
    await ctx.reply('Error!');
  }
}