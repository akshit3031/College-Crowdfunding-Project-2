require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');


module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
      gas: 6721975,
      gasPrice: 20000000000,
      skipDryRun: true
    },
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: 5777,
      gas: 6721975,
      gasPrice: 20000000000,
      skipDryRun: true
    },
    goerli: {
      provider: () => new HDWalletProvider(
        process.env.PRIVATE_KEY,
        `https://goerli.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
      ),
      network_id: 5,       // Goerli network ID
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    sepolia: {
      provider: () => new HDWalletProvider(
        process.env.PRIVATE_KEY,
        process.env.SEPOLIA_ID
      ),
      network_id: 11155111, // Sepolia network ID
      networkCheckTimeout: 1000000,     

      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    }
  },

  compilers: {
    solc: {
      version: "0.8.19",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        },
        evmVersion: "london"
      }
    }
  },

  mocha: {
    timeout: 100000
  }
};
