const { database } = require('../db');

function findTokenByName(admin, tokenName) {
  return database.ref(`admins/${admin}/tokens/${tokenName}`).once('value');
}

function addToken(admin, tokenName, currency, maxCap, startTime, endTime) {
  return database.ref(`admins/${admin}/tokens/${tokenName}`).set({
    currency: currency,
    maxCap: maxCap,
    startTime: startTime,
    endTime: endTime,
  })
}

module.exports = {
  addToken,
  findTokenByName,
};
