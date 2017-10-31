const { web3 } = require('../w3');
var Tx = require('ethereumjs-tx');
var abi = require('../../contracts/abi/deal.json');
const { getAccountAddress } = require('../database/linkAccount');
const { getFundAddress, getFundPrivateKey } = require('../database/fund');
const { getICOByName } = require('../database/deal');

async function getInvestorBalance(username, icoName, investorAddress) {
  let icoData = await getICOByName(username, icoName);

  let contract = new web3.eth.Contract(abi, icoData['contractAddress']);
  let balance = await contract.methods.investorBalances(investorAddress).call();
  return balance();
  // let gasEstimate = await instance.estimateGas();
  // data = instance.encodeABI();
  // var txcount = await web3.eth.getTransactionCount(fundAddress);
  // var rawTx = {
  //     to: icoData['contractAddress'],
  //     nonce: web3.utils.toHex(txcount),
  //     gasPrice: web3.utils.toHex(1000099000),
  //     gasLimit: gasEstimate * 4,
  //     data: data
  //   }
  // var tx = new Tx(rawTx);
  // tx.sign(privateKey);
  // var serializedTx = tx.serialize();
  // receipt = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
  // return receipt;
}

async function test() {
  let balance = await getInvestorBalance('ryan_le', 'test1');
  console.log(balance);
}

test();
// module.exports = initializeDealContract;
