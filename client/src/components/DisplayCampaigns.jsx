import React from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";
import FundCard from './FundCard';
import { loader } from '../assets';

const DisplayCampaigns = ({ title, isLoading, campaigns }) => {
  const navigate = useNavigate();

  const handleNavigate = (campaign) => {
    navigate(`/campaign-details/${campaign.address}`, { state: campaign });
  };
  
  // Calculate summary statistics
  const totalCampaigns = campaigns.length;
  const totalRaised = campaigns.reduce((sum, campaign) => sum + parseFloat(campaign.balance || 0), 0);
  const totalTarget = campaigns.reduce((sum, campaign) => sum + parseFloat(campaign.targetAmount || 0), 0);
  const activeCampaigns = campaigns.filter(campaign => parseFloat(campaign.balance || 0) < parseFloat(campaign.targetAmount || 0)).length;

  console.log("Campaigns:", campaigns);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h1 className="font-epilogue font-semibold text-[18px] text-gray-800 text-left">
          {title} ({totalCampaigns})
        </h1>
        
        {/* Summary Statistics */}
        {totalCampaigns > 0 && (
          <div className="flex flex-wrap gap-4 mt-4 sm:mt-0">
            <div className="bg-white border border-gray-200 rounded-lg px-3 py-2">
              <p className="text-[10px] text-gray-600 font-medium">TOTAL RAISED</p>
              <p className="text-[14px] font-semibold text-[#E62727]">{totalRaised.toFixed(3)} ETH</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg px-3 py-2">
              <p className="text-[10px] text-gray-600 font-medium">TARGET AMOUNT</p>
              <p className="text-[14px] font-semibold text-[#1E93AB]">{totalTarget.toFixed(3)} ETH</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg px-3 py-2">
              <p className="text-[10px] text-gray-600 font-medium">ACTIVE CAMPAIGNS</p>
              <p className="text-[14px] font-semibold text-[#8b0000]">{activeCampaigns}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
        )}

        {!isLoading && campaigns.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-gray-600">
            No campaigns available
          </p>
        )}

        {!isLoading && campaigns && campaigns.length > 0 && campaigns.map((campaign) => (
          <FundCard 
            key={uuidv4()}
            owner={campaign.student}
            title={campaign.title}
            description={campaign.description}
            target={campaign.targetAmount}
            targetAmount={campaign.targetAmount}
            amountCollected={campaign.balance}
            balance={campaign.balance}
            image={campaign.image}
            studentRoll={campaign.studentRoll}
            address={campaign.address}
            handleClick={() => handleNavigate(campaign)}
          />
        ))}
      </div>
    </div>
  );
};

export default DisplayCampaigns;
