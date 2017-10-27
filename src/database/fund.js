const { database } = require('../db');

async function doesFundExist(username) {
  const data = await database.ref(`admins/${username}/fund`).once('value');
  return (data.val() === null) ? false : true;
}

async function setFundAddress(username, address) {
  return database.ref(`admins/${username}/fund/address`).set(address);
}

async function setFundPrivateKey(username, privateKey) {
  return database.ref(`admins/${username}/fund/privateKey`).set(privateKey);
}

async function getFundAddress(username) {
  const data = await database.ref(`admins/${username}/fund/address`).once('value');
  return data.val();
}

async function getFundPrivateKey(username) {
  const data = await database.ref(`admins/${username}/fund/privateKey`).once('value');
  return data.val();
}

module.exports = {
  doesFundExist, 
  getFundAddress, 
  getFundPrivateKey,
  setFundAddress,
  setFundPrivateKey,
};
