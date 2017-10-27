var Web3 = require('web3');
let KOVAN_RPC_URL = 'https://kovan.infura.io/metamask';
let provider = new Web3.providers.HttpProvider(KOVAN_RPC_URL);
let web3 = new Web3(provider);

module.exports = async (address) => {
  const balance = await web3.eth.getBalance(address);
  return balance;
}