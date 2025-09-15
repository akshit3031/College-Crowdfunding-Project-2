require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");

require("dotenv").config();

module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {},
    local: {
      url: "http://127.0.0.1:8545",
      accounts: [process.env.LOCAL_PRIVATE_KEY], // use the private key from Hardhat accounts
    },
  },
};
