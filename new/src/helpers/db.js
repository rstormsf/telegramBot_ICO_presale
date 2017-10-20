const User = require('../models/user');

function findUserByIdAndUpdate(id, updates) {
  return User.findByIdAndUpdate(id, updates, { upsert: true, new: true });
}

function isUserAuthorized(ctx) {
  return ctx.user && ctx.user.key;
}

module.exports = {
  findUserByIdAndUpdate,
  isUserAuthorized,
};