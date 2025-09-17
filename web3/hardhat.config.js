require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
  solidity: {
    compilers: [
      { version: "0.8.26" }, // for your new contract
      { version: "0.8.9" },  // keep for old contracts if needed
    ],
  },
  networks: {
    hardhat: {},
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: process.env.LOCAL_PRIVATE_KEY ? [process.env.LOCAL_PRIVATE_KEY] : [],
    },
  },
};
