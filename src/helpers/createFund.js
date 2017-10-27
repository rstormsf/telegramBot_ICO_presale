const { web3 } = require('../w3');
const { setFundAddress, setFundPrivateKey } = require('../database/fund');

function getNakedAddress(address) {
  return address.toLowerCase().replace('0x', '');
}

module.exports = async (username) => {
  const wallet = await web3.eth.accounts.wallet.create(1);
  await setFundAddress(username, wallet[0].address);
  await setFundPrivateKey(username, getNakedAddress(wallet[0].privateKey));
}
