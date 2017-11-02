const { web3 } = require('../w3');
var Tx = require('ethereumjs-tx');
var abi = require('../../contracts/abi/presale.abi.json');
const { getICOByName } = require('../database/deal');

async function getRemainingCap(username, icoName) {
  let icoData = await getICOByName(username, icoName);
  let contract = new web3.eth.Contract(abi, icoData['contractAddress']);
  let totalInvested = await contract.methods.totalInvestedInWei().call();
  let cap = await contract.methods.cap().call();
  let remaining = cap - totalInvested;
  let ether = await web3.utils.fromWei(remaining, 'ether');
  return ether;
}

module.exports = getRemainingCap;
