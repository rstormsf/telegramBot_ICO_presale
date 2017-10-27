var Web3 = require('web3');
let KOVAN_RPC_URL = 'https://kovan.infura.io/metamask';
let provider = new Web3.providers.HttpProvider(KOVAN_RPC_URL);
const web3 = new Web3(provider);

module.exports = { web3 };