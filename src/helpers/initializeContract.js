const { web3 } = require('../w3');
var Tx = require('ethereumjs-tx');
var abi = require('../../contracts/abi/deal.json');
const { getAccountAddress } = require('../database/linkAccount');
const { getFundAddress, getFundPrivateKey } = require('../database/fund');

async function initializeDealContract(username, contractAddress, icoName) {
  fundAddress = await getFundAddress(username);
  fundPrivateKey = await getFundPrivateKey(username);
  ownerAddress = await getAccountAddress(username);
  icoData = await getICOByName(username, icoName);

  var privateKey = new Buffer(fundPrivateKey, 'hex');
  let contract = new web3.eth.Contract(abi, contractAddress);
  let instance = await contract.methods.initialize(
    ownerAddress, 
    icoData['startTime'], 
    icoData['endTime'], 
    icoData['maxCap']
  ).call();
  data = instance.encodeABI();
  var txcount = await web3.eth.getTransactionCount(fundAddress);
  var rawTx = {
      nonce: web3.utils.toHex(txcount),
      gasPrice: web3.utils.toHex(1000099000),
      gasLimit: web3.utils.toHex(470918),
      data: data
    }
  var tx = new Tx(rawTx);
  tx.sign(fundPrivateKey);
  var serializedTx = tx.serialize();
  receipt = await web3.eth.sendSignedTransaction(serializedTx.toString('hex'));
}
