var Web3 = require('web3');
let KOVAN_RPC_URL = 'https://kovan.infura.io/metamask';
let provider = new Web3.providers.HttpProvider(KOVAN_RPC_URL);
let web3 = new Web3(provider);
const { setFundAddress, setFundPrivateKey } = require('../database/fund');

module.exports = async (username) => {
  const wallet = await web3.eth.accounts.wallet.create(1);
  await setFundAddress(username, wallet[0].address);
  await setFundPrivateKey(username, wallet[0].privateKey);
}
