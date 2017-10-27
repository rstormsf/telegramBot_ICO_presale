const { web3 } = require('../w3');
const { setFundAddress, setFundPrivateKey } = require('../database/fund');

module.exports = async (username) => {
  const wallet = await web3.eth.accounts.wallet.create(1);
  await setFundAddress(username, wallet[0].address);
  await setFundPrivateKey(username, wallet[0].privateKey);
}
