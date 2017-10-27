const { web3 } = require('../w3');
const { getFundAddress } = require('../database/fund');

module.exports = async (username) => {
  fundAddress = await getFundAddress(username);
  if (fundAddress == null) {
    return 0;
  }
  const balance = await web3.eth.getBalance(fundAddress);
  return balance;
}