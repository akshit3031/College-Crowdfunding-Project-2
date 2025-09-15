import React, { createContext, useContext, useState } from "react";
import { ethers } from "ethers";
import CollegeCampaignFactoryABI from "../abi/CollegeCampaignFactory.json";
import CollegeCampaignABI from "../abi/CollegeCampaign.json";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const [campaigns, setCampaigns] = useState([]); // ← store campaigns

  const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
  const signer = new ethers.Wallet(
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    provider
  );

  const factoryContract = new ethers.Contract(
    "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    CollegeCampaignFactoryABI.abi,
    signer
  );

  const createCampaign = async (form) => {
    try {
      const nonce = await provider.getTransactionCount(signer.address);
      if (!form.minimumContribution || !form.targetAmount) {
        throw new Error("Minimum contribution or target amount missing");
      }

      const tx = await factoryContract.createCampaign(
        ethers.utils.parseEther(form.minimumContribution.toString()),
        form.title,
        form.description,
        form.image,
        ethers.utils.parseEther(form.targetAmount.toString()),
        form.studentRoll,
        { nonce }
      );

      await tx.wait();
      console.log("Campaign created:", tx.hash);

      // After creation, fetch all campaigns again
      await fetchCampaigns();
    } catch (error) {
      console.error("Failed to create campaign:", error);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const addresses = await factoryContract.getDeployedCampaigns();

      const data = await Promise.all(
        addresses.map(async (address) => {
          const campaignContract = new ethers.Contract(
            address,
            CollegeCampaignABI.abi,
            signer
          );
          const summary = await campaignContract.getSummary();
          const studentRollNumber = await campaignContract.studentRollNumber();

          return {
            address,
            minimumContribution: ethers.utils.formatEther(summary[0].toString()),
            balance: ethers.utils.formatEther(summary[1].toString()),
            requestsCount: summary[2].toNumber(),
            student: summary[3],
            title: summary[4],
            description: summary[5],
            image: summary[6],
            targetAmount: ethers.utils.formatEther(summary[7].toString()),
            studentRoll: studentRollNumber,
          };
        })
      );

      setCampaigns(data); // ← save to state
      return data;
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
      return [];
    }
  };

 return (
  <StateContext.Provider
    value={{
      address: signer.address,
      factoryContract,
      createCampaign,
      campaigns,
      fetchCampaigns, 
      getCampaigns: fetchCampaigns, // <--- add alias so Home.js works
      signer,
    }}
  >
    {children}
  </StateContext.Provider>
);
};

export const useStateContext = () => useContext(StateContext);
