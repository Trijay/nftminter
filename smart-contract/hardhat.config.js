require("@nomiclabs/hardhat-waffle");
const keys = require('../src/keys');

//Remove Before Pushing the code
const ALCHEMY_API_KEY= keys.ALCHEMY_API_KEY;
const ROPSTEN_PRIVATE_KEY = keys.ROPSTEN_PRIVATE_KEY;


task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",

  networks : {
    ropsten: {
      url : `https://eth-ropsten.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,  
      accounts: [`${ROPSTEN_PRIVATE_KEY}`]  
    }
  }
};
