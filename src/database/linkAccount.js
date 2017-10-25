const { database } = require('../db');

async function isAccountLinked(user) {
  const data = await database.ref(`users/${user}/address`).once('value');
  return (data.val() === null) ? false : true;
}

async function linkAddressToAccount(user, eth_address) {
  await database.ref(`users/${user}/address`).set({
    address: eth_address,
  });
}

module.exports = {
  isAccountLinked,
  linkAddressToAccount
};