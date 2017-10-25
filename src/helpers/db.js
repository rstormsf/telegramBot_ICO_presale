const { database } = require('../db');

async function isAdmin(username) {
  const data = await database.ref(`admins/${username}`).once('value');
  return (data.val() === null) ? false : true;
}

function login(username) {
  database.ref(`users/${username}/log`).set({ 
    lastTime: Date.now() 
  });
}

function getMembers(admin) {
  return database.ref(`admins/${admin}/members`).once('value');
}

function getMemberByName(admin, user) {
 return database.ref(`admins/${admin}/members/${user}`).once('value');
}

async function getMemberCount(admin) {
  const members = await database.ref(`admins/${admin}/members`).once('value');
  const memberCount = await members.numChildren();
  return memberCount === null ? 0 : memberCount;
}

async function addMember(admin, user) {
  await database.ref(`users/${user}/syndicates/${admin}`).set({
    isMember: true,
  });
  await database.ref(`admins/${admin}/members/${user}`).set({
    isMember: true,
  });
}

async function removeMember(admin, user) {
  await database.ref(`users/${user}/syndicates/${admin}`).remove();
  await database.ref(`admins/${admin}/members/${user}`).remove();
}

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

async function getSyndicateCount(user) {
  const syndicates = await database.ref(`users/${user}/syndicates`).once('value');
  const syndicateCount = await syndicates.numChildren();
  return (syndicateCount === null) ? 0 : syndicateCount;
}

async function getSyndicates(user) {
  return database.ref(`users/${user}/syndicates`).once('value');
}

module.exports = {
  addMember, 
  removeMember,  
  getMembers,
  getMemberByName, 
  getMemberCount, 
  getSyndicateCount, 
  getSyndicates, 
  isAdmin,
  login, 
  addToken,
  findTokenByName,
};