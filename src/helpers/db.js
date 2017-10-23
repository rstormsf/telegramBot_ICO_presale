const User = require('../models/user');

function findUserByIdAndUpdate(id, updates) {
  return User.findByIdAndUpdate(id, updates, { upsert: true, new: true });
}

function createUserById(id) {
  return User.create({ _id: id });
}

function isUserAuthorized(ctx) {
  return ctx.user && ctx.user.key;
}

module.exports = {
  createUserById,
  findUserByIdAndUpdate,
  isUserAuthorized,
};