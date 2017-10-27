var Web3 = require('web3');
let KOVAN_RPC_URL = 'https://kovan.infura.io/metamask';
let provider = new Web3.providers.HttpProvider(KOVAN_RPC_URL);
let web3 = new Web3(provider);
const { getFundAddress } = require('../database/fund');

module.exports = async (username) => {
  fundAddress = await getFundAddress(username);
  if (fundAddress == null) {
    return 0;
  }
  const balance = await web3.eth.getBalance(fundAddress);
  return balance;
}