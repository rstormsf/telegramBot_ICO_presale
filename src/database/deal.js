const { database } = require('../db');

function getICOByName(admin, tokenName) {
  return database.ref(`admins/${admin}/ICO/${ICOName}`).once('value');
}

function addICO(admin, tokenName, currency, maxCap, startTime, endTime) {
  return database.ref(`admins/${admin}/ICO/${ICOName}`).set({
    currency: currency,
    maxCap: maxCap,
    startTime: startTime,
    endTime: endTime,
  })
}

module.exports = {
  addICO,
  getICOByName,
};
