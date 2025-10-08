import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import CollegeCampaignFactoryABI from "../abi/CollegeCampaignFactory.json";
import CollegeCampaignABI from "../abi/CollegeCampaign.json";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [address, setAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [factoryContract, setFactoryContract] = useState(null);

  // Initialize MetaMask connection
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const account = accounts[0];
        setAddress(account);

        const prov = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(prov);

        const sign = prov.getSigner();
        setSigner(sign);

        const factory = new ethers.Contract(
          import.meta.env.VITE_FACTORY_ADDRESS,
          CollegeCampaignFactoryABI.abi,
          sign
        );
        setFactoryContract(factory);

      } catch (err) {
        console.error("Wallet connection failed:", err);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  // Fetch campaigns
  const fetchCampaigns = async () => {
    if (!factoryContract || !signer) return [];
    try {
      const addresses = await factoryContract.getDeployedCampaigns();
      const data = await Promise.all(
        addresses.map(async (address) => {
          const campaignContract = new ethers.Contract(address, CollegeCampaignABI.abi, signer);
          const summary = await campaignContract.getSummary();
          const studentRollNumber = await campaignContract.studentRollNumber();
          return {
            address,
            minimumContribution: ethers.utils.formatEther(summary[0]),
            balance: ethers.utils.formatEther(summary[1]),
            requestsCount: summary[2].toNumber(),
            student: summary[3],
            title: summary[4],
            description: summary[5],
            image: summary[6],
            targetAmount: ethers.utils.formatEther(summary[7]),
            studentRoll: studentRollNumber,
          };
        })
      );
      setCampaigns(data);
      return data;
    } catch (err) {
      console.error("Failed to fetch campaigns:", err);
      return [];
    }
  };

  // Create campaign (user connected via MetaMask)
  const createCampaign = async (form) => {
    if (!factoryContract) return;
    try {
      const tx = await factoryContract.createCampaign(
        ethers.utils.parseEther(form.minimumContribution.toString()),
        form.title,
        form.description,
        form.image,
        ethers.utils.parseEther(form.targetAmount.toString()),
        form.studentRoll
      );
      await tx.wait();
      await fetchCampaigns();
    } catch (err) {
      console.error("Failed to create campaign:", err);
    }
  };

  // Example: get user campaigns
  const getUserCampaigns = async () => {
    const allCampaigns = await fetchCampaigns();
    return allCampaigns.filter((c) => c.student.toLowerCase() === address.toLowerCase());
  };

  useEffect(() => {
    connectWallet();
  }, []);

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
        address,
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
