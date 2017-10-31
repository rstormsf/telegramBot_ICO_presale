const { web3 } = require('../w3');
var Tx = require('ethereumjs-tx');
var abi = require('../../contracts/abi/deal.json');
const { getICOByName } = require('../database/deal');

async function getInvestorBalance(username, icoName, investorAddress) {
  let icoData = await getICOByName(username, icoName);
  let contract = new web3.eth.Contract(abi, icoData['contractAddress']);
  let balance = await contract.methods.investorBalances(investorAddress).call();
  ether = await web3.utils.fromWei(balance, 'ether');
  return ether;
}

module.exports = getInvestorBalance;
