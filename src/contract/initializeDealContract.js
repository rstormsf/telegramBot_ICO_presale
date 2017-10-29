const { web3 } = require('../w3');
var Tx = require('ethereumjs-tx');
var abi = require('../../contracts/abi/deal.json');
const { getAccountAddress } = require('../database/linkAccount');
const { getFundAddress, getFundPrivateKey } = require('../database/fund');
const { getICOByName } = require('../database/deal');

async function initializeDealContract(username, icoName) {
  let fundAddress = await getFundAddress(username);
  let fundPrivateKey = await getFundPrivateKey(username);
  let ownerAddress = await getAccountAddress(username);
  let icoData = await getICOByName(username, icoName);

  var privateKey = new Buffer(fundPrivateKey, 'hex');
  let startTime = new Date(icoData['startTime']).getTime()/1000|0;
  let endTime = new Date(icoData['endTime']).getTime()/1000|0;
  let contract = new web3.eth.Contract(abi, icoData['contractAddress']);
  let instance = await contract.methods.initialize(
    ownerAddress, 
    startTime, 
    endTime, 
    web3.utils.toWei(icoData['maxCap'], 'ether')
  );
  let gasEstimate = await instance.estimateGas();
  data = instance.encodeABI();
  var txcount = await web3.eth.getTransactionCount(fundAddress);
  var rawTx = {
      to: icoData['contractAddress'],
      nonce: web3.utils.toHex(txcount),
      gasPrice: web3.utils.toHex(1000099000),
      gasLimit: gasEstimate * 4,
      data: data
    }
  var tx = new Tx(rawTx);
  tx.sign(privateKey);
  var serializedTx = tx.serialize();
  receipt = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
  return receipt;
}

// async function test() {
//   let receipt = await initializeDealContract('ryan_le', 'test1');
//   console.log(receipt);
// }

// test();
module.exports = initializeDealContract;
