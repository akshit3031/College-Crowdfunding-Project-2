import React, { useContext, createContext } from "react";
import { ethers } from "ethers";
import CrowdFundingABI from "../abi/CrowdFunding.json";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  // Local Hardhat RPC
  const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

  // Use the first account from Hardhat node
  const signer = new ethers.Wallet(
    "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d" /* private key from Hardhat node */,
    provider
  );

  const contract = new ethers.Contract(
    "0x5FbDB2315678afecb367f032d93F642f64180aa3", // deployed contract
    CrowdFundingABI.abi,
    signer
  );

  // publish a campaign
  const publishCampaign = async (form) => {
    try {
      const tx = await contract.createCampaign(
        signer.address,
        form.title,
        form.description,
        form.target,
        new Date(form.deadline).getTime(),
        form.image
      );
      await tx.wait();
      console.log("campaign created:", tx.hash);
    } catch (error) {
      console.error("contract call failure", error);
    }
  };
  const getDonations = async (pId) => {
  try {
    const donations = await contract.getDonators(pId); // returns [donators[], amounts[]]
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString()),
      });
    }

    return parsedDonations;
  } catch (error) {
    console.error("Failed to fetch donations", error);
    return [];
  }
};

  const getCampaigns = async () => {
    const campaigns = await contract.getCampaigns();
    return campaigns.map((c, i) => ({
      owner: c.owner,
      title: c.title,
      description: c.description,
      target: ethers.utils.formatEther(c.target.toString()),
      deadline: c.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(c.amountCollected.toString()),
      image: c.image,
      pId: i,
    }));
  };

  return (
    <StateContext.Provider
      value={{
        address: signer.address,
        contract,
        createCampaign: publishCampaign,
        getCampaigns,
         getDonations, 
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
