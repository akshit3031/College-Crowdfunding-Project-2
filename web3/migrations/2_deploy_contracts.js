const CollegeCampaignFactory = artifacts.require("CollegeCampaignFactory");

module.exports = function (deployer) {
  deployer.deploy(CollegeCampaignFactory, {gas: 5000000});
};