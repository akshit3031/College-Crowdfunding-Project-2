const hre = require("hardhat");

async function main() {
  // 1. Get the contract factory for CollegeCampaignFactory
  const CollegeCampaignFactory = await hre.ethers.getContractFactory("CollegeCampaignFactory");

  // 2. Deploy the factory contract
  const factory = await CollegeCampaignFactory.deploy();

  // 3. Wait for deployment to be mined
  await factory.deployed();

  console.log(`CollegeCampaignFactory deployed to: ${factory.address}`);
  
  // Optional: add a teacher immediately after deployment
  // const [admin, teacher] = await hre.ethers.getSigners();
  // const tx = await factory.addTeacher(teacher.address);
  // await tx.wait();
  // console.log(`Teacher added: ${teacher.address}`);
}

// Run the script and catch errors
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
