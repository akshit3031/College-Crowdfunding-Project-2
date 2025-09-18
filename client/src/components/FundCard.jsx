import React from 'react';

import { tagType, thirdweb } from '../assets';

const FundCard = ({ owner, title, description, target, amountCollected, image, handleClick, studentRoll, targetAmount, balance, address }) => {
  
  // Calculate funding percentage
  const fundingPercentage = targetAmount && parseFloat(targetAmount) > 0 
    ? ((parseFloat(balance || amountCollected || 0) / parseFloat(targetAmount)) * 100).toFixed(1)
    : 0;
  
  // Format ETH amounts for display
  const formatEth = (amount) => {
    if (!amount) return "0";
    const num = parseFloat(amount);
    return num > 0 ? num.toFixed(3) : "0";
  };

  return (
    <div className="w-full max-w-[320px] lg:max-w-[280px] xl:max-w-[300px] rounded-[15px] bg-white border-2 border-[#DCDCDC] hover:border-[#1E93AB] cursor-pointer transition-all duration-300 hover:shadow-lg" onClick={handleClick}>
      <img 
        src={image || "https://via.placeholder.com/400x200/E5E7EB/6B7280?text=Campaign+Image"} 
        alt="campaign" 
        className="w-full h-[158px] object-cover rounded-t-[15px]"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/400x200/E5E7EB/6B7280?text=Campaign+Image";
        }}
      />

      <div className="flex flex-col p-4">
        {/* Category Tag */}
        <div className="flex flex-row items-center mb-[15px]">
          <img src={tagType} alt="tag" className="w-[17px] h-[17px] object-contain"/>
          <p className="ml-[12px] mt-[2px] font-epilogue font-medium text-[12px] text-[#1E93AB]">Campaign</p>
        </div>

        {/* Campaign Title */}
        <div className="block mb-3">
          <h3 className="font-epilogue font-semibold text-[16px] text-gray-800 text-left leading-[24px] mb-2" title={title}>
            {title && title.length > 50 ? `${title.substring(0, 50)}...` : title}
          </h3>
          
          {/* Student Information */}
          <div className="bg-[#F8F9FA] rounded-lg p-2 mb-2">
            {studentRoll && (
              <p className="font-epilogue font-medium text-[12px] text-[#1E93AB] text-center">
                Roll No: {studentRoll}
              </p>
            )}
          </div>
          
          <p className="font-epilogue font-normal text-[13px] text-gray-600 text-left leading-[18px]" title={description}>
            {description && description.length > 80 ? `${description.substring(0, 80)}...` : description}
          </p>
        </div>

        {/* Funding Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-epilogue font-medium text-[12px] text-gray-600">Funding Progress</span>
            <span className="font-epilogue font-semibold text-[12px] text-[#1E93AB]">{fundingPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-[#1E93AB] to-[#8b0000] h-2 rounded-full transition-all duration-300" 
              style={{ width: `${Math.min(parseFloat(fundingPercentage), 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Funding Details */}
        <div className="flex justify-between flex-wrap gap-2 mb-4">
          <div className="flex flex-col">
            <h4 className="font-epilogue font-semibold text-[14px] text-[#E62727] leading-[22px]">
              {formatEth(balance || amountCollected)} ETH
            </h4>
            <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-gray-600">
              Raised of {formatEth(targetAmount || target)} ETH
            </p>
          </div>
          <div className="flex flex-col text-right">
            <h4 className="font-epilogue font-semibold text-[14px] text-[#1E93AB] leading-[22px]">
              {formatEth(targetAmount ? Math.max(0, parseFloat(targetAmount) - parseFloat(balance || amountCollected || 0)).toFixed(3) : 0)} ETH
            </h4>
            <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-gray-600">
              Still Needed
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FundCard