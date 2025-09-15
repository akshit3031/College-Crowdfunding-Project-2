const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const CrowdFunding = await hre.ethers.getContractFactory("CrowdFunding");

  // Deploy contract
  const crowdFunding = await CrowdFunding.deploy();

  // Wait for deployment
  await crowdFunding.deployed();

  console.log(`CrowdFunding deployed to: ${crowdFunding.address}`);
}

// Run script
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
