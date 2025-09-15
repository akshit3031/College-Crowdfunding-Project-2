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
    local: {
      url: "http://127.0.0.1:8545",
      accounts: [process.env.LOCAL_PRIVATE_KEY],
    },
  },
};
