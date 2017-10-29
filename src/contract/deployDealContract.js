var Tx = require('ethereumjs-tx');
const { web3 } = require('../w3');
var abi = require('../../contracts/abi/deal.json');
  // const bytecode = await fs.readFile(process.cwd() + 
  //   '/contracts/abi/bytecode.txt', (err) => console.log(err));
const bytecode = require('../../contracts/abi/bytecode');

const { getFundAddress, getFundPrivateKey } = require('../database/fund');

async function deployDealContract(username) {
  const fundPrivateKey = await getFundPrivateKey(username);
  const fundAddress = await getFundAddress(username);
  let contract = new web3.eth.Contract(abi);
  let instance = await contract.deploy({data: bytecode});
  let gasEstimate = await instance.estimateGas();
  var privateKey = new Buffer(fundPrivateKey, 'hex');
  var txcount = await web3.eth.getTransactionCount(fundAddress);
  var rawTx = {
    nonce: web3.utils.toHex(txcount),
    gasPrice: web3.utils.toHex(1000099000),
    gasLimit: gasEstimate * 4,
    data: bytecode
  }
  var tx = new Tx(rawTx);
  tx.sign(privateKey);
  
  var serializedTx = tx.serialize();
  
  receipt = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
  return receipt['contractAddress'];
}

// async function test() {
//   let address = await deployDealContract('ryan_le');
//   console.log(address);
// }

// test();

module.exports = deployDealContract;
