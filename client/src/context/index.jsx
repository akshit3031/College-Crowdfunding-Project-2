import React, { createContext, useContext, useState } from "react";
import { ethers } from "ethers";
import CollegeCampaignFactoryABI from "../abi/CollegeCampaignFactory.json";
import CollegeCampaignABI from "../abi/CollegeCampaign.json";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const [campaigns, setCampaigns] = useState([]); // ← store campaigns

  const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:7545");
  const signer = new ethers.Wallet(
    "0x3082ac546e9acfd12dc94b642df2cc5c3900c505f716c68cdf311abbf6082227",
    provider
  );

  const factoryContract = new ethers.Contract(
    "0xEff8C79A37C0c577f80E4CA9d596bdA738eb29FE",
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
      setCampaigns(data);
      return data;
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
      return [];
    }
  };

  // Get campaigns started by the current user
  const getUserCampaigns = async () => {
    const allCampaigns = await fetchCampaigns();
    return allCampaigns.filter((c) => c.student.toLowerCase() === signer.address.toLowerCase());
  };

  // Check if current user is a teacher
  const isTeacher = async () => {
    try {
      return await factoryContract.teachers(signer.address);
    } catch (error) {
      console.error("Failed to check teacher status:", error);
      return false;
    }
  };

  // Get withdrawal requests for a campaign
  const getWithdrawalRequests = async (campaignAddress) => {
    try {
      const campaignContract = new ethers.Contract(
        campaignAddress,
        CollegeCampaignABI.abi,
        signer
      );
      
      const requestsCount = await campaignContract.getRequestsCount();
      const requests = [];
      
      for (let i = 0; i < requestsCount; i++) {
        const request = await campaignContract.requests(i);
        requests.push({
          index: i,
          description: request.description,
          value: ethers.utils.formatEther(request.value),
          recipient: request.recipient,
          completed: request.completed,
          approvalCount: request.approvalCount.toNumber()
        });
      }
      
      return requests;
    } catch (error) {
      console.error("Failed to fetch withdrawal requests:", error);
      return [];
    }
  };

  // Create withdrawal request (for campaign owner/student)
  const createWithdrawalRequest = async (campaignAddress, description, value, recipient) => {
    try {
      const campaignContract = new ethers.Contract(
        campaignAddress,
        CollegeCampaignABI.abi,
        signer
      );
      
      const tx = await campaignContract.createWithdrawalRequest(
        description,
        ethers.utils.parseEther(value.toString()),
        recipient
      );
      
      await tx.wait();
      return true;
    } catch (error) {
      console.error("Failed to create withdrawal request:", error);
      return false;
    }
  };

  // Approve withdrawal request (for teachers) - now automatically sends ETH
  const approveWithdrawalRequest = async (campaignAddress, requestIndex) => {
    try {
      const campaignContract = new ethers.Contract(
        campaignAddress,
        CollegeCampaignABI.abi,
        signer
      );
      
      // Teachers approve and ETH is automatically sent to recipient
      const approveTx = await campaignContract.approveRequest(requestIndex);
      await approveTx.wait();
      console.log("Request approved successfully and ETH sent to recipient");
      
      return true;
    } catch (error) {
      console.error("Failed to approve withdrawal request:", error);
      return false;
    }
  };

  // Check if current user is admin
  const isAdmin = async () => {
    try {
      const adminAddress = await factoryContract.admin();
      return adminAddress.toLowerCase() === signer.address.toLowerCase();
    } catch (error) {
      console.error("Failed to check admin status:", error);
      return false;
    }
  };

  // Add teacher (admin only)
  const addTeacher = async (teacherAddress) => {
    try {
      const tx = await factoryContract.addTeacher(teacherAddress);
      await tx.wait();
      return true;
    } catch (error) {
      console.error("Failed to add teacher:", error);
      return false;
    }
  };

  // Remove teacher (admin only)
  const removeTeacher = async (teacherAddress) => {
    try {
      const tx = await factoryContract.removeTeacher(teacherAddress);
      await tx.wait();
      return true;
    } catch (error) {
      console.error("Failed to remove teacher:", error);
      return false;
    }
  };

  // Get all withdrawal requests from all campaigns
  const getAllWithdrawalRequests = async () => {
    try {
      const allCampaigns = await fetchCampaigns();
      const allRequests = [];

      for (const campaign of allCampaigns) {
        const campaignContract = new ethers.Contract(
          campaign.address,
          CollegeCampaignABI.abi,
          signer
        );
        
        const requestsCount = await campaignContract.getRequestsCount();
        
        for (let i = 0; i < requestsCount; i++) {
          const request = await campaignContract.requests(i);
          allRequests.push({
            campaignAddress: campaign.address,
            campaignTitle: campaign.title,
            studentName: campaign.student,
            studentRoll: campaign.studentRoll,
            requestIndex: i,
            description: request.description,
            value: ethers.utils.formatEther(request.value),
            recipient: request.recipient,
            completed: request.completed,
            approvalCount: request.approvalCount.toNumber()
          });
        }
      }
      
      return allRequests;
    } catch (error) {
      console.error("Failed to fetch all withdrawal requests:", error);
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
        getCampaigns: fetchCampaigns,
        getUserCampaigns,
        isTeacher,
        getWithdrawalRequests,
        createWithdrawalRequest,
        approveWithdrawalRequest,
        isAdmin,
        addTeacher,
        removeTeacher,
        getAllWithdrawalRequests,
        signer,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
