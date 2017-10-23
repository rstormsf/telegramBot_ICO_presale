const mongoose = require('mongoose');

const userModel = mongoose.Schema({
  _id: {type: Number, required: true},
  username: String, 
  key: String,
  account: String,
  token: String,
  timestamp: { type: Date, default: () => new Date() },
}, {collection: 'ico_users'});

module.exports = mongoose.model('User', userModel);
